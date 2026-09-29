"""
Shared Gemini client wrapper for all agents.

Centralizes API key resolution, retry policy, model fallback, and
structured-JSON output so every agent gets the same resilient behaviour.

API key resolution order:
  1. MongoDB.configs (key = 'GEMINI_API_KEY') — set via the Node admin UI
     at /admin/api-config. Cached in-process for 60 seconds.
  2. .env (settings.ai_service_api_key) — boot-time fallback if MongoDB
     is unreachable or has no key stored.

This means an admin rotating the key via the UI takes effect within
60 seconds without restarting the Python service — the standard pattern
for credential management in a multi-service architecture.
"""

import json
import logging
import time
from typing import Optional, Type, TypeVar

import httpx
from google import genai
from google.genai import types
from google.genai import errors as genai_errors
from pydantic import BaseModel
from pymongo import MongoClient
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

RETRYABLE = (
    genai_errors.ServerError,
    httpx.RemoteProtocolError,
    httpx.ReadTimeout,
    httpx.ConnectTimeout,
    httpx.ConnectError,
    httpx.ReadError,
    httpx.WriteError,
)

# ─────────────────────────────────────────────────────────────────────
# API key cache
#
# Every 60 seconds we re-query MongoDB for a fresh key. Between checks
# we reuse the cached value. This bounds MongoDB load to ≤1 query per
# minute per Python process regardless of request volume.
# ─────────────────────────────────────────────────────────────────────
_KEY_CACHE = {
    "value": None,
    "source": None,       # 'mongo' | 'env'
    "checked_at": 0.0,
}
_KEY_CACHE_TTL = 60  # seconds


def _fetch_key_from_mongo() -> Optional[str]:
    """Return the GEMINI_API_KEY from MongoDB.configs, or None on failure."""
    if not settings.mongo_uri:
        return None
    try:
        client = MongoClient(settings.mongo_uri, serverSelectionTimeoutMS=2000)
        db = client.get_default_database()   # db name from URI path (cv-screening)
        doc = db.configs.find_one({"key": "GEMINI_API_KEY"})
        client.close()
        if doc and doc.get("value"):
            return str(doc["value"]).strip()
    except Exception as e:
        logger.warning("MongoDB key lookup failed: %s", e)
    return None


def _resolve_api_key() -> str:
    """
    Resolve the Gemini key. Prefers MongoDB; falls back to .env.
    Result is cached for _KEY_CACHE_TTL seconds.
    """
    now = time.time()
    if _KEY_CACHE["value"] and (now - _KEY_CACHE["checked_at"]) < _KEY_CACHE_TTL:
        return _KEY_CACHE["value"]

    mongo_key = _fetch_key_from_mongo()
    if mongo_key:
        if _KEY_CACHE["value"] != mongo_key:
            logger.info("Loaded new Gemini API key from MongoDB")
        _KEY_CACHE.update(value=mongo_key, source="mongo", checked_at=now)
        return mongo_key

    env_key = settings.ai_service_api_key
    if _KEY_CACHE["source"] != "env":
        logger.info("Using Gemini API key from .env (MongoDB unavailable)")
    _KEY_CACHE.update(value=env_key, source="env", checked_at=now)
    return env_key


class GeminiAgentBase:
    def __init__(self):
        # Client is built lazily so a key rotation is picked up on the
        # next call without restarting the process.
        self._client: Optional[genai.Client] = None
        self._client_key: Optional[str] = None

    def _get_client(self) -> genai.Client:
        """
        Return a Gemini client. Rebuild it if the resolved key has
        changed since the last call.
        """
        key = _resolve_api_key()
        if self._client is None or self._client_key != key:
            if self._client is not None:
                logger.info("Rebuilding Gemini client with rotated key")
            self._client = genai.Client(
                api_key=key,
                http_options=types.HttpOptions(timeout=20_000),
            )
            self._client_key = key
        return self._client

    @retry(
        stop=stop_after_attempt(1),
        wait=wait_exponential(multiplier=1, min=1, max=2),
        retry=retry_if_exception_type(RETRYABLE),
        before_sleep=before_sleep_log(logger, logging.WARNING),
        reraise=True,
    )
    def _call_gemini(self, model_name: str, prompt: str, response_schema: Type[T]):
        logger.info("Gemini call: model=%s schema=%s",
                    model_name, response_schema.__name__)
        client = self._get_client()
        return client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=response_schema,
                temperature=0.0,
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

        Non-retryable errors (auth, malformed request) raise immediately.
        """
        last_err: Optional[Exception] = None

        for model_name in MODEL_FALLBACK_CHAIN:
            try:
                response = self._call_gemini(model_name, prompt, response_schema)

                if getattr(response, "parsed", None) is not None:
                    return response.parsed
                return response_schema(**json.loads(response.text))

            except genai_errors.ClientError as e:
                msg = str(e).lower()
                if any(tok in msg for tok in
                       ("404", "not_found", "no longer available",
                        "429", "quota", "resource_exhausted")):
                    logger.warning("%s unavailable/quota-exhausted, next model",
                                   model_name)
                    last_err = e
                    continue
                # 401 / 403 / 400 — auth or malformed. Abort immediately.
                raise

            except genai_errors.ServerError as e:
                logger.warning("%s server error (%s), next model",
                               model_name, getattr(e, "code", "5xx"))
                last_err = e
                continue

            except (httpx.RemoteProtocolError, httpx.ReadTimeout,
                    httpx.ConnectTimeout, httpx.ConnectError,
                    httpx.ReadError, httpx.WriteError) as e:
                logger.warning("%s transport error (%s), next model",
                               model_name, type(e).__name__)
                last_err = e
                continue

        raise RuntimeError(
            f"All {len(MODEL_FALLBACK_CHAIN)} Gemini models failed. "
            f"Last error: {last_err}"
        )