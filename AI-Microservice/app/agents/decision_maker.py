"""
AI Agent 03 – Decision Maker

Takes the EvaluationResult from Agent 02 and produces the final
recommendation shown to HR users on the frontend.
"""

from app.schemas.candidate import EvaluationResult, DecisionResult

VALID_RECOMMENDATIONS = ("Highly Recommended", "Recommended", "Not Recommended")


class DecisionMakerAgent:
    def analyze_evaluator_result(self, evaluation: EvaluationResult) -> None:
        """
        Analyze evaluator result.
        TODO: any pre-processing/sanity-checking of the EvaluationResult
        before generating a recommendation from it (e.g. flag if
        match_percentage and matching/missing skill counts don't line up).
        """
        raise NotImplementedError("analyze_evaluator_result not implemented yet")

    def generate_recommendation(self, evaluation: EvaluationResult) -> str:
        """
        Generate recommendation: 'Highly Recommended' | 'Recommended' |
        'Not Recommended'.
        TODO: define the thresholds/logic (e.g. based on match_percentage
        and/or missing_skills count) that map an EvaluationResult onto one
        of the three allowed values in VALID_RECOMMENDATIONS above.
        """
        raise NotImplementedError("generate_recommendation not implemented yet")

    def generate_recommendation_justification(
        self, evaluation: EvaluationResult, recommendation: str
    ) -> str:
        """
        Generate recommendation justification.
        TODO: produce a short, human-readable explanation of why this
        recommendation was given, referencing the matching/missing skills
        and experience assessment. This text is shown directly to HR users,
        so it should read naturally, not just dump raw data.
        """
        raise NotImplementedError("generate_recommendation_justification not implemented yet")

    def run(self, evaluation: EvaluationResult) -> DecisionResult:
        """
        Orchestrates the methods above into one DecisionResult.
        This is the only method the pipeline orchestrator calls directly.
        """
        self.analyze_evaluator_result(evaluation)
        recommendation = self.generate_recommendation(evaluation)

        if recommendation not in VALID_RECOMMENDATIONS:
            raise ValueError(f"Invalid recommendation produced: {recommendation}")

        justification = self.generate_recommendation_justification(evaluation, recommendation)

        return DecisionResult(recommendation=recommendation, justification=justification)
