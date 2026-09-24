"""
AI Agent 03 – Decision Maker

Turns an EvaluationResult into a DecisionResult: a categorical
recommendation plus a short natural-language justification.
"""

import logging

from pydantic import BaseModel, Field

from app.agents.base import GeminiAgentBase
from app.schemas.candidate import DecisionResult, EvaluationResult

logger = logging.getLogger(__name__)

VALID_RECOMMENDATIONS = ("Highly Recommended", "Recommended", "Not Recommended")

# Thresholds — tune to taste. All logic is deterministic and auditable.
_HIGHLY_MIN_SCORE = 75.0
_HIGHLY_MAX_MISSING = 2
_RECOMMENDED_MIN_SCORE = 50.0


class _Justification(BaseModel):
    justification: str = Field(...,
        description="2-4 sentences of plain English addressed to an HR reviewer")


class DecisionMakerAgent(GeminiAgentBase):

    # ---------- Sanity checks ----------
    def analyze_evaluator_result(self, evaluation: EvaluationResult) -> None:
        if not (0 <= evaluation.match_percentage <= 100):
            raise ValueError(f"Invalid match_percentage: {evaluation.match_percentage}")

        total = len(evaluation.matching_skills) + len(evaluation.missing_skills)
        if total == 0:
            logger.warning("No required skills supplied — decision based on experience only.")

        if (evaluation.match_percentage >= _HIGHLY_MIN_SCORE
                and len(evaluation.missing_skills) > _HIGHLY_MAX_MISSING):
            logger.warning(
                "High score (%.1f) but %d missing skills — result may look inconsistent.",
                evaluation.match_percentage, len(evaluation.missing_skills),
            )

    # ---------- Deterministic recommendation ----------
    def generate_recommendation(self, evaluation: EvaluationResult) -> str:
        score = evaluation.match_percentage
        missing = len(evaluation.missing_skills)
        matched = len(evaluation.matching_skills)

        # If we have no signal at all, don't trust the numeric score alone.
        if matched == 0 and missing == 0:
            logger.warning(
                "No skill-match signal for this evaluation; treating as inconclusive."
            )
            return "Not Recommended"

        if score >= _HIGHLY_MIN_SCORE and missing <= _HIGHLY_MAX_MISSING:
            return "Highly Recommended"
        if score >= _RECOMMENDED_MIN_SCORE:
            return "Recommended"
        return "Not Recommended"

    # ---------- Justification ----------
    def generate_recommendation_justification(self, evaluation, recommendation) -> str:
        # ─────────────────────────────────────────────────────────────
        # CHANGED: template-only. Saves one LLM call per screening —
        # 33% less API pressure while Google's free tier is congested.
        #
        # To re-enable the LLM-generated justification, DELETE the
        # `return` line directly below. Everything after it is intact.
        # ─────────────────────────────────────────────────────────────
        return self._template_justification(evaluation, recommendation)

        # ─── LLM path (unreachable while the short-circuit above exists) ───
        prompt = f"""
        You are an HR assistant writing a short justification for a
        candidate screening recommendation. The text will be shown directly
        to HR reviewers, so it must read naturally — no bullet lists, no
        raw data dumps, no jargon.

        Recommendation: {recommendation}
        Match score: {evaluation.match_percentage:.1f}/100
        Matching skills: {', '.join(evaluation.matching_skills) or '(none)'}
        Missing skills: {', '.join(evaluation.missing_skills) or '(none)'}
        Experience note: {evaluation.experience_assessment or '(no assessment)'}

        Write 2-4 sentences justifying the recommendation. Reference
        specific skills by name and mention experience fit. Do not invent
        facts not present above. Do not use phrases like "despite having"
        or "although". State the decision and the two or three facts that
        drove it. Keep it under 60 words.
        """
        try:
            result = self.generate_structured(prompt, _Justification)
            return result.justification.strip()
        except Exception as e:
            logger.warning("Justification LLM call failed (%s); using template", e)
            return self._template_justification(evaluation, recommendation)

    @staticmethod
    def _template_justification(evaluation, recommendation) -> str:
        matching = ", ".join(evaluation.matching_skills) or "none"
        missing = ", ".join(evaluation.missing_skills) or "none"
        exp = (evaluation.experience_assessment or "").strip()
        return (
            f"{recommendation} (match score {evaluation.match_percentage:.0f}/100). "
            f"Matching skills: {matching}. Missing skills: {missing}. {exp}"
        ).strip()

    # ---------- Entry point ----------
    def run(self, evaluation: EvaluationResult) -> DecisionResult:
        self.analyze_evaluator_result(evaluation)
        recommendation = self.generate_recommendation(evaluation)
        if recommendation not in VALID_RECOMMENDATIONS:
            raise ValueError(f"Invalid recommendation: {recommendation}")
        justification = self.generate_recommendation_justification(evaluation, recommendation)
        return DecisionResult(recommendation=recommendation, justification=justification)