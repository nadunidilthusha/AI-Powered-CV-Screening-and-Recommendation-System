from fastapi import APIRouter, Depends
from app.schemas.request import ScreeningRequest
from app.schemas.candidate import ScreeningResponse
from app.pipeline.orchestrator import ScreeningPipeline
from app.api.dependencies import verify_api_key

router = APIRouter()
pipeline = ScreeningPipeline()


@router.post(
    "/screen",
    response_model=ScreeningResponse,
    dependencies=[Depends(verify_api_key)],
    summary="Run the 3-agent CV screening pipeline for one candidate against one job",
)
async def screen_candidate(payload: ScreeningRequest) -> ScreeningResponse:
    """
    Matches exactly what the Node.js backend calls in
    services/aiService.js -> screenCandidate():

        POST /screen
        { filePath, jobDescription, requiredSkills }

    Runs all three agents in sequence and returns their combined output.
    Once each agent's TODOs are implemented, this endpoint requires no
    further changes.
    """
    return pipeline.run(
        file_path=payload.filePath,
        job_description=payload.jobDescription,
        required_skills=payload.requiredSkills,
    )
