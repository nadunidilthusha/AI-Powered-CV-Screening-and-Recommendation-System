"""
Runs the full 3-agent screening pipeline in sequence:
  Agent 01 (Information Extractor) -> Agent 02 (HR Evaluator) -> Agent 03 (Decision Maker)

This is the only piece the API layer (app/api/screening.py) talks to —
it doesn't need to know about the individual agents at all.
"""

from app.agents.information_extractor import InformationExtractorAgent
from app.agents.hr_evaluator import HrEvaluatorAgent
from app.agents.decision_maker import DecisionMakerAgent
from app.schemas.candidate import ScreeningResponse


class ScreeningPipeline:
    def __init__(self):
        self.extractor = InformationExtractorAgent()
        self.evaluator = HrEvaluatorAgent()
        self.decision_maker = DecisionMakerAgent()

    def run(self, file_path: str, job_description: str, required_skills: list[str]) -> ScreeningResponse:
        """
        REL-1 (SRS): each agent call is a natural retry boundary if it fails
        due to a flaky LLM API call. Retry logic can be added around each
        of the three `.run(...)` calls below independently once the agents
        are implemented, rather than retrying the whole pipeline at once.
        """
        candidate = self.extractor.run(file_path)
        evaluation = self.evaluator.run(candidate, job_description, required_skills)
        decision = self.decision_maker.run(evaluation)

        return ScreeningResponse(candidate=candidate, evaluation=evaluation, decision=decision)
