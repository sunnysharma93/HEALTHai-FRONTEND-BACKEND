from google import genai
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY)
        logger.info("Gemini service ready!")

    def generate(self, prompt: str) -> str:
        try:
            response = self.client.models.generate_content(
                model='gemini-1.5-flash',
                contents=prompt
            )
            return response.text
        except Exception as e:
            logger.error(f"Gemini error: {e}")
            return "Response generate nahi hua!"

    def chat(self, message: str) -> str:
        try:
            response = self.client.models.generate_content(
                model='gemini-1.5-flash',
                contents=message
            )
            return response.text
        except Exception as e:
            logger.error(f"Chat error: {e}")
            return "Chat response nahi aaya!"

gemini_service = GeminiService()
