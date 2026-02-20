"""
Application Configuration
"""
import json
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings"""

    # Tell Pydantic where .env is (v2 style)
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )

    # Service Configuration
    SERVICE_NAME: str = "messaging-backend"
    SERVICE_PORT: int = 8000
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 10

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_CACHE_TTL: int = 3600

    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    CELERY_TASK_SERIALIZER: str = "json"
    CELERY_RESULT_SERIALIZER: str = "json"

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS Configuration
    CORS_ORIGINS: str = ""  # Comma-separated string, will be parsed to list
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    CORS_ALLOW_HEADERS: List[str] = ["Content-Type", "Authorization"]
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS_ORIGINS string to list
        Handles both comma-separated and JSON array formats
        """
        if not self.CORS_ORIGINS:
            return []
        
        cors_str = self.CORS_ORIGINS.strip()
        
        # Try to parse as JSON array first (in case it comes as JSON string from env)
        if cors_str.startswith('[') and cors_str.endswith(']'):
            try:
                parsed = json.loads(cors_str)
                if isinstance(parsed, list):
                    return [str(origin).strip() for origin in parsed if origin]
            except (json.JSONDecodeError, TypeError):
                pass
        
        # Otherwise, treat as comma-separated string
        origins = [origin.strip().strip('"').strip("'") for origin in cors_str.split(",") if origin.strip()]
        # Remove any remaining brackets or quotes
        return [origin.strip('[]"\'') for origin in origins if origin]

    # Message Provider
    MESSAGE_PROVIDER_API_KEY: str = ""
    MESSAGE_PROVIDER_API_URL: str = ""
    MESSAGE_PROVIDER_WEBHOOK_SECRET: str = ""
    MESSAGE_PROVIDER_TIMEOUT: int = 30

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"

    # Health Check
    HEALTH_CHECK_ENABLED: bool = True


settings = Settings()
