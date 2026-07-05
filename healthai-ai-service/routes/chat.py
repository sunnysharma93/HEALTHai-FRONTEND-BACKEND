from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest, AIResponse
from services.gemini_service import gemini_service
import logging

router = APIRouter(prefix="/ai", tags=["AI"])
logger = logging.getLogger(__name__)

@router.post("/chat", response_model=AIResponse)
async def chat(request: ChatRequest):
    try:
        prompt = f"""
Tu ek friendly fitness AI assistant hai.
User message: {request.message}
Hinglish mein helpful fitness advice do.
"""
        response = gemini_service.chat(prompt)
        return AIResponse(response=response)
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
