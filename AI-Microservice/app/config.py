from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Loads and validates environment variables on startup. If a required
    field is missing, pydantic-settings raises a clear validation error
    immediately rather than failing confusingly deep inside a request.
    """

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: str = "development"
    host: str = "0.0.0.0"
    port: int = 8000

    ai_service_api_key: str  # required — no default, must be set in .env

    llm_provider: str = "openai"  # "openai" | "gemini"
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    gemini_api_key: str = ""
    gemini_model: str = "gemini-1.5-flash"

    max_file_size_mb: int = 5

    allowed_origin: str = "http://localhost:5000"


settings = Settings()
