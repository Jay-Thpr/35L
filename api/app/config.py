from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseModel):
    database_url: str
    omdb_api_key: str
    openai_api_key: str

def get_settings() -> Settings:
    return Settings(
        database_url=os.getenv(
            "DATABASE_URL",
            "postgresql+psycopg://postgres:postgres@localhost:5432/cinematch",
        ),
        omdb_api_key=os.getenv("OMDB_API_KEY", ""),
        openai_api_key=os.getenv("OPENAI_API_KEY", ""),
    )
