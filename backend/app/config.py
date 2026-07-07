# Reads environment variables from the .env file.
# We use pydantic-settings so values are typed and validated.

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    gemini_api_key: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Create a single instance — import this everywhere instead of re-reading the file
settings = Settings()