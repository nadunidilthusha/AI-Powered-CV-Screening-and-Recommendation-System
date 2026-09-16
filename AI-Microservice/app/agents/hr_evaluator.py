"""
AI Agent 02 – HR Evaluator

Takes the ExtractedCandidate from Agent 01, compares it against the job
description and required skills, and produces an EvaluationResult.
"""

from app.schemas.candidate import ExtractedCandidate, EvaluationResult


class HrEvaluatorAgent:
    def compare_cv_with_job_description(
        self, candidate: ExtractedCandidate, job_description: str
    ) -> str:
        """
        Compare CV with Job Description.
        TODO: send the candidate's extracted skills/experience alongside the
        job description text to the LLM, and get back its raw comparison
        analysis (to be parsed by the methods below, or returned as-is for
        the justification step in Agent 03).
        """
        raise NotImplementedError("compare_cv_with_job_description not implemented yet")

    def identify_matching_skills(
        self, candidate_skills: list[str], required_skills: list[str]
    ) -> list[str]:
        """
        Identify matching skills.
        TODO: return the subset of required_skills the candidate actually has.
        """
        raise NotImplementedError("identify_matching_skills not implemented yet")

    def identify_missing_skills(
        self, candidate_skills: list[str], required_skills: list[str]
    ) -> list[str]:
        """
        Identify missing skills.
        TODO: return the subset of required_skills the candidate does NOT have.
        """
        raise NotImplementedError("identify_missing_skills not implemented yet")

    def evaluate_experience(
        self, candidate: ExtractedCandidate, job_description: str
    ) -> str:
        """
        Evaluate experience.
        TODO: assess whether the candidate's experience level/years fit
        what the job description asks for. Return a short assessment string.
        """
        raise NotImplementedError("evaluate_experience not implemented yet")

    def calculate_match_percentage(
        self, matching_skills: list[str], required_skills: list[str], experience_assessment: str
    ) -> float:
        """
        Calculate Match Percentage.
        TODO: combine skill overlap + experience fit into a single 0-100 score.
        Keep the scoring logic deterministic/explainable where possible,
        since HR users will want to trust why a score is what it is.
        """
        raise NotImplementedError("calculate_match_percentage not implemented yet")

    def validate_ai_evaluation_response(self, evaluation: EvaluationResult) -> None:
        """
        Validate AI evaluation response.
        REL-2 (SRS): guard against LLM hallucination — e.g. reject a result
        if match_percentage is out of range, or if matching_skills contains
        a skill that isn't actually in required_skills. Raise a ValueError
        (or a custom exception) if validation fails, so the orchestrator can
        retry or mark the candidate as processingStatus='Failed'.
        """
        raise NotImplementedError("validate_ai_evaluation_response not implemented yet")

    def run(
        self, candidate: ExtractedCandidate, job_description: str, required_skills: list[str]
    ) -> EvaluationResult:
        """
        Orchestrates the methods above into one EvaluationResult.
        This is the only method the pipeline orchestrator calls directly.
        """
        self.compare_cv_with_job_description(candidate, job_description)
        matching = self.identify_matching_skills(candidate.skills, required_skills)
        missing = self.identify_missing_skills(candidate.skills, required_skills)
        experience_assessment = self.evaluate_experience(candidate, job_description)
        match_percentage = self.calculate_match_percentage(matching, required_skills, experience_assessment)

        result = EvaluationResult(
            matching_skills=matching,
            missing_skills=missing,
            experience_assessment=experience_assessment,
            match_percentage=match_percentage,
        )
        self.validate_ai_evaluation_response(result)
        return result
