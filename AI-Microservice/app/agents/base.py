"""
Shared Gemini client wrapper for all agents.

Centralizes API key setup, retry policy, model fallback, and
structured-JSON output so every agent gets the same resilient behaviour.

Free-tier reality check:
- Each model has its own 20-req/day quota bucket, so spreading calls
  across many models multiplies the effective daily allowance.
- Lite-tier models are the most heavily contended. If every Lite model
  is 503ing, we fall through to older-generation or regular Flash models
  which often have more spare capacity.
- Retries on 503 are futile — Google's edge is shedding load, and no
  amount of waiting will fix that. We fail fast and let the caller decide.
"""

import json
import logging
from typing import Optional, Type, TypeVar

import httpx
from google import genai
from google.genai import types
from google.genai import errors as genai_errors
from pydantic import BaseModel
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
    before_sleep_log,
)

from app.config import settings

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)

# Order matters: Lite models first (fastest, cheapest), older and
# regular Flash models last (rarely 503, but slower). Every entry has
# its own free-tier quota bucket, so more entries = more daily headroom.
MODEL_FALLBACK_CHAIN = [
    "gemini-flash-lite-latest",
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
    "gemini-flash-latest",
]

# Errors that trigger a retry *within the same model*. We do NOT retry
# 4xx errors (auth, bad request, 429) — those need different handling.
#
# NOTE: with stop_after_attempt(1) below, this tuple is effectively
# unused. It's kept so that if you decide to re-enable retries later,
# the correct exceptions are already listed.
RETRYABLE = (
    genai_errors.ServerError,
    httpx.RemoteProtocolError,
    httpx.ReadTimeout,
    httpx.ConnectTimeout,
    httpx.ConnectError,
    httpx.ReadError,
    httpx.WriteError,
)


class GeminiAgentBase:
    def __init__(self):
        self.client = genai.Client(
            api_key=settings.ai_service_api_key,
            http_options=types.HttpOptions(
                timeout=20_000,   # 20 seconds — if Google can't respond in 20s, it won't
                                   # can legitimately take 30–60s on long CVs
            ),
        )

    @retry(
        # No retries on the same model — see module docstring for why.
        # Fall-through happens inside generate_structured() instead.
        stop=stop_after_attempt(1),
        wait=wait_exponential(multiplier=1, min=1, max=2),
        retry=retry_if_exception_type(RETRYABLE),
        before_sleep=before_sleep_log(logger, logging.WARNING),
        reraise=True,
    )
    def _call_gemini(self, model_name: str, prompt: str, response_schema: Type[T]):
        logger.info("Gemini call: model=%s schema=%s",
                    model_name, response_schema.__name__)
        return self.client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=response_schema,
                temperature=0.0,   # deterministic output across runs
            ),
        )

    def generate_structured(self, prompt: str, response_schema: Type[T]) -> T:
        """
        Try each model in MODEL_FALLBACK_CHAIN until one succeeds.

        Fall-through conditions (per model):
        - 404 / retired / not available        → next model
        - 429 / quota exhausted                → next model
        - 5xx (500 / 502 / 503 / 504)          → next model
        - httpx transport errors               → next model

        Non-retryable errors (auth, malformed request) raise immediately
        so the caller sees the real problem instead of a generic failure.
        """
        last_err: Optional[Exception] = None

        for model_name in MODEL_FALLBACK_CHAIN:
            try:
                response = self._call_gemini(model_name, prompt, response_schema)

                # The new SDK populates .parsed when response_schema is a
                # Pydantic model. Fall back to parsing .text for older SDKs.
                if getattr(response, "parsed", None) is not None:
                    return response.parsed
                return response_schema(**json.loads(response.text))

            except genai_errors.ClientError as e:
                # 4xx from Gemini. Some are retryable by falling through,
                # others (auth) should abort immediately.
                msg = str(e).lower()
                if any(tok in msg for tok in
                       ("404", "not_found", "no longer available",
                        "429", "quota", "resource_exhausted")):
                    logger.warning("%s unavailable/quota-exhausted, next model",
                                   model_name)
                    last_err = e
                    continue
                # 401 / 403 / 400 — not going to get better on another model
                raise

            except genai_errors.ServerError as e:
                # 500 / 502 / 503 / 504 — Google-side problem, try next model
                logger.warning("%s server error (%s), next model",
                               model_name, getattr(e, "code", "5xx"))
                last_err = e
                continue

            except (httpx.RemoteProtocolError, httpx.ReadTimeout,
                    httpx.ConnectTimeout, httpx.ConnectError,
                    httpx.ReadError, httpx.WriteError) as e:
                # Transport-level issue (connection dropped, hung, refused).
                # The next model will open a fresh connection.
                logger.warning("%s transport error (%s), next model",
                               model_name, type(e).__name__)
                last_err = e
                continue

        raise RuntimeError(
            f"All {len(MODEL_FALLBACK_CHAIN)} Gemini models failed. "
            f"Last error: {last_err}"
        )