from typing import Optional
from pydantic import BaseModel, Field


class ExtractedCandidate(BaseModel):
    """
    Output of AI Agent 01 – Information Extractor.
    One field per checklist item: name, contact info, education,
    experience, technical skills, all pulled from the extracted PDF text.
    """

    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    education: list[str] = Field(default_factory=list)
    experience: list[str] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)


class EvaluationResult(BaseModel):
    """
    Output of AI Agent 02 – HR Evaluator.
    Compares the ExtractedCandidate against the job description/required
    skills and produces a match score plus the skill gap analysis.
    """

    matching_skills: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)
    experience_assessment: Optional[str] = None
    match_percentage: float = Field(..., ge=0, le=100)


class DecisionResult(BaseModel):
    """
    Output of AI Agent 03 – Decision Maker.
    Reads the EvaluationResult and produces the final recommendation
    shown on the frontend's candidate list/details pages.
    """

    recommendation: str = Field(
        ..., description="One of: 'Highly Recommended', 'Recommended', 'Not Recommended'"
    )
    justification: str


class ScreeningResponse(BaseModel):
    """
    Full pipeline output returned to the Node.js backend from POST /screen.
    The backend maps this onto its Candidate model fields.
    """

    candidate: ExtractedCandidate
    evaluation: EvaluationResult
    decision: DecisionResult
