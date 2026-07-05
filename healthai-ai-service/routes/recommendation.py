from fastapi import APIRouter, HTTPException
from models.schemas import RecommendationRequest, AIResponse
from services.gemini_service import gemini_service
import logging

router = APIRouter(prefix="/ai", tags=["AI"])
logger = logging.getLogger(__name__)

@router.post("/recommend", response_model=AIResponse)
async def get_recommendation(request: RecommendationRequest):
    try:
        health = request.health_data
        prompt = f"""
Tu ek expert fitness trainer hai.
User data:
- Weight: {health.weight}kg, Height: {health.height}cm
- Age: {health.age}, Gender: {health.gender}
- Goal: {health.goal}, BMI: {health.bmi}
- Activity: {health.activity_level}
- Daily Calories: {health.daily_calorie_target}

Question: {request.question or 'Best workout aur diet plan kya hoga?'}

Hinglish mein practical advice do — 5 points mein.
"""
        response = gemini_service.generate(prompt)
        return AIResponse(response=response)
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health-tips/{goal}")
async def get_health_tips(goal: str):
    try:
        prompt = f"{goal} goal ke liye top 5 fitness tips do — Hinglish mein."
        response = gemini_service.generate(prompt)
        return {"goal": goal, "tips": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
