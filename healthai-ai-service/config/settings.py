from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    KAFKA_SERVERS: str = os.getenv(
        "KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    CHROMA_DB_PATH: str = os.getenv(
        "CHROMA_DB_PATH", "./chroma_db")
    APP_PORT: int = int(os.getenv("APP_PORT", "8085"))

settings = Settings()