import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

logger = logging.getLogger("ai_service")


def register_error_handlers(app: FastAPI) -> None:
    """
    Centralizes error handling for the whole app, mirroring the Node.js
    backend's errorHandler.js — every error, wherever it's raised, ends up
    with the same clean JSON shape instead of a raw traceback reaching
    the caller (the Node.js backend).
    """

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False,
                "message": "Validation failed",
                "details": exc.errors(),
            },
        )

    @app.exception_handler(NotImplementedError)
    async def not_implemented_handler(request: Request, exc: NotImplementedError):
        # Every agent method currently raises this until implemented —
        # surfaces as a clean 501 instead of a raw 500 traceback.
        return JSONResponse(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            content={"success": False, "message": str(exc)},
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        # REL-1 (SRS): catch-all so a failed LLM API call (timeout, bad
        # response, rate limit, etc.) never crashes the process or leaks
        # an internal stack trace back to the Node.js backend.
        logger.exception("Unhandled error in AI service")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "message": "Internal AI service error"},
        )
