"""
AI Agent 02 – HR Evaluator

Compares an ExtractedCandidate against a job description + required skills
and produces an EvaluationResult.

Design notes:
- Skill matching is pure Python (deterministic, free, unhallucinatable).
- Experience fit is scored by an LLM and encoded as '<score> - <text>'
  inside the assessment string, so no cross-method state is needed.
- Match percentage is a fixed 70/30 blend of skills and experience, but
  falls back to experience-only when required_skills is empty.
"""

import logging
import re

from pydantic import BaseModel, Field

from app.agents.base import GeminiAgentBase
from app.schemas.candidate import ExtractedCandidate, EvaluationResult

logger = logging.getLogger(__name__)


class _ExperienceAssessment(BaseModel):
    score: int = Field(..., ge=0, le=100,
                       description="0-100 fit score for experience vs. the job")
    assessment: str = Field(..., description="One or two sentences explaining the score")


# CHANGED: alias map collapses common variants so that, for example,
# a CV saying "NodeJS" still matches a JD asking for "Node.js". Add new
# entries here as you encounter them — no other code needs to change.
_ALIASES = {
    "nodejs": "node.js",
    "node": "node.js",
    "reactjs": "react",
    "react.js": "react",
    "expressjs": "express",
    "express.js": "express",
    "rest api": "rest apis",
    "restful api": "rest apis",
    "restful apis": "rest apis",
    "api integration": "rest apis",
    "apis": "rest apis",
    "js": "javascript",
    "ts": "typescript",
    "mongo": "mongodb",
    "postgres": "postgresql",
    "spring": "spring boot",
}


def _norm(s: str) -> str:
    """
    Case/whitespace-insensitive comparison key for a skill name.

    CHANGED: now also applies the alias map so that semantic equivalents
    compare equal.
    """
    key = re.sub(r"\s+", " ", s.strip().lower())
    return _ALIASES.get(key, key)


class HrEvaluatorAgent(GeminiAgentBase):

    # ---------- Skill overlap (pure Python) ----------
    def identify_matching_skills(self, candidate_skills, required_skills):
        candidate_keys = {_norm(s) for s in candidate_skills}
        return [s for s in required_skills if _norm(s) in candidate_keys]

    def identify_missing_skills(self, candidate_skills, required_skills):
        candidate_keys = {_norm(s) for s in candidate_skills}
        return [s for s in required_skills if _norm(s) not in candidate_keys]

    # ---------- Comparison summary (heuristic; result is discarded in run()) ----------
    def compare_cv_with_job_description(self, candidate, job_description) -> str:
        skills = ", ".join(candidate.skills) or "(none)"
        exp = "; ".join(candidate.experience[:3]) or "(none)"
        return (
            f"Candidate {candidate.full_name or 'unknown'} — skills: {skills}. "
            f"Recent experience: {exp}. JD length: {len(job_description)} chars."
        )

    # ---------- Experience assessment (LLM) ----------
    def evaluate_experience(self, candidate, job_description) -> str:
        """
        Returns a string of the form '<score> - <assessment text>'.
        The numeric prefix is parsed by calculate_match_percentage().
        """
        prompt = f"""
        You are an experienced HR analyst. Rate how well the candidate's
        work history matches the role described below.

        Rules:
        - Score 0-100 for EXPERIENCE FIT only (ignore skills).
        - 0 = unrelated; 50 = some overlap; 75 = strong fit; 100 = exact mirror.
        - The assessment must be 1-2 plain-English sentences referencing
          concrete items from the CV. Do not invent facts.

        JOB DESCRIPTION:
        {job_description}

        CANDIDATE EXPERIENCE:
        {chr(10).join('- ' + e for e in candidate.experience) or '(none listed)'}

        CANDIDATE EDUCATION:
        {chr(10).join('- ' + e for e in candidate.education) or '(none listed)'}
        """
        try:
            result = self.generate_structured(prompt, _ExperienceAssessment)
            return f"{result.score} - {result.assessment}"
        except Exception as e:
            logger.warning("Experience LLM call failed (%s); using neutral score", e)
            return "50 - Experience assessment unavailable; treated as neutral."

    # ---------- Score aggregation ----------
    _EXP_PREFIX = re.compile(r"^\s*(\d{1,3})\s*[-–—]\s*(.*)$", re.DOTALL)

    def calculate_match_percentage(self, matching_skills, required_skills, experience_assessment):
        # Experience: parse the '<score> - ...' prefix if present.
        exp_score = 50.0
        m = self._EXP_PREFIX.match(experience_assessment or "")
        if m:
            try:
                exp_score = float(m.group(1))
            except ValueError:
                pass
        exp_score = max(0.0, min(100.0, exp_score))

        # If we weren't given any target skills, we can only score experience.
        # Returning the blended score here would produce a fake-looking 70%.
        if not required_skills:
            logger.warning("No required_skills provided; scoring on experience only.")
            return round(exp_score, 2)

        # Skills: fraction of required skills present.
        skill_score = 100.0 * len(matching_skills) / len(required_skills)

        # 70/30 weighting favours skills because they're deterministic.
        final = 0.7 * skill_score + 0.3 * exp_score
        return round(max(0.0, min(100.0, final)), 2)

    # ---------- Validation (REL-2) ----------
    def validate_ai_evaluation_response(self, evaluation: EvaluationResult) -> None:
        if not (0 <= evaluation.match_percentage <= 100):
            raise ValueError(f"match_percentage out of range: {evaluation.match_percentage}")

        # A skill must not appear in both lists.
        overlap = {_norm(s) for s in evaluation.matching_skills} & \
                  {_norm(s) for s in evaluation.missing_skills}
        if overlap:
            raise ValueError(f"Skills in both matching and missing: {overlap}")

        # Reject implausible shapes (hallucination guard).
        if len(evaluation.matching_skills) > 100 or len(evaluation.missing_skills) > 100:
            raise ValueError("Skill lists implausibly long — likely hallucination.")

    # ---------- Entry point ----------
    def run(self, candidate, job_description, required_skills) -> EvaluationResult:
        self.compare_cv_with_job_description(candidate, job_description)
        matching = self.identify_matching_skills(candidate.skills, required_skills)
        missing = self.identify_missing_skills(candidate.skills, required_skills)
        experience_assessment = self.evaluate_experience(candidate, job_description)
        match_percentage = self.calculate_match_percentage(
            matching, required_skills, experience_assessment
        )

        result = EvaluationResult(
            matching_skills=matching,
            missing_skills=missing,
            experience_assessment=experience_assessment,
            match_percentage=match_percentage,
        )
        self.validate_ai_evaluation_response(result)
        return result