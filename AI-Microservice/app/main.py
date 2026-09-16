from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.routes import router as api_router
from app.middleware.error_handler import register_error_handlers

app = FastAPI(
    title="AI-Powered CV Screening — AI Microservice",
    description="Multi-agent CV screening pipeline: Information Extractor, HR Evaluator, Decision Maker.",
    version="1.0.0",
)

# Only the Node.js backend should call this service directly.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.allowed_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_error_handlers(app)

app.include_router(api_router)


@app.get("/", tags=["Health"])
async def root():
    return {"success": True, "message": "AI-Powered CV Screening AI microservice"}
