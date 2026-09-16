from fastapi import Header, HTTPException, status
from app.config import settings


def verify_api_key(x_api_key: str = Header(...)) -> None:
    """
    Confirms the request came from the Node.js backend, not a random
    caller. The backend's services/aiService.js sends this same value as
    the X-API-Key header on every request — must match AI_SERVICE_API_KEY
    in both services' .env files.
    """
    if x_api_key != settings.ai_service_api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")
