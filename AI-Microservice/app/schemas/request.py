from pydantic import BaseModel, Field


class ScreeningRequest(BaseModel):
    """
    Matches the payload sent by the Node.js backend's services/aiService.js:

        aiClient.post('/screen', { filePath, jobDescription, requiredSkills })

    filePath: path to the already-uploaded CV PDF on shared storage
              (or an S3 key, depending on how file storage is set up).
    jobDescription: full text of the job posting's description field.
    requiredSkills: the job's requiredSkills array, used by Agent 02
                    (HR Evaluator) to compute matching/missing skills.
    """

    filePath: str = Field(..., description="Path or storage key of the uploaded CV PDF")
    jobDescription: str = Field(..., description="Full text of the job description")
    requiredSkills: list[str] = Field(default_factory=list, description="Required skills for the job")
