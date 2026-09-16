from fastapi import APIRouter
from app.config import settings

router = APIRouter()


@router.get("/health", summary="Basic liveness check")
async def health_check():
    return {
        "success": True,
        "message": "AI microservice is running",
        "environment": settings.environment,
    }
