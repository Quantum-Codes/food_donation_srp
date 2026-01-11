from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import Optional
from pathlib import Path


# Resolve .env location robustly (supports app/.env or backend/.env)
_APP_DIR = Path(__file__).resolve().parent
_BACKEND_DIR = _APP_DIR.parent
_CWD = Path.cwd()

def _find_env_file() -> str:
    candidates = [
        _APP_DIR / ".env",           # backend/app/.env
        _BACKEND_DIR / ".env",       # backend/.env
        _CWD / ".env",               # current working directory
    ]
    for p in candidates:
        if p.exists():
            return str(p)
    # default fallback; pydantic will just use environment
    return ".env"


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Supabase Configuration
    supabase_url:  str
    supabase_key: str
    supabase_service_key: str
    
    # JWT Configuration
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours default
    
    # Application Settings
    app_name: str = "Food Donation API"
    debug: bool = False
    
    # Optional:  API versioning
    api_v1_prefix: str = "/api"
    
    # Pydantic v2 configuration
    model_config = SettingsConfigDict(
        env_file=_find_env_file(),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached application settings.
    
    Uses lru_cache to ensure settings are only loaded once
    and reused across the application.
    
    Returns:
        Settings: Application settings instance
    """
    return Settings()


# For convenience, create a settings instance that can be imported directly
settings = get_settings()