from fastapi import APIRouter
from app.api import health, screening

router = APIRouter()

router.include_router(health.router, tags=["Health"])
router.include_router(screening.router, tags=["Screening"])
