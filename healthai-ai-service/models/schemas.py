from pydantic import BaseModel
from typing import Optional, List

# Workout data Java se aayega
class WorkoutData(BaseModel):
    email: str
    exercise_name: str
    category: str
    duration_mins: int
    calories_burned: float

# Health profile data
class HealthData(BaseModel):
    weight: Optional[float] = None
    height: Optional[float] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    activity_level: Optional[str] = None
    goal: Optional[str] = None
    bmi: Optional[float] = None
    daily_calorie_target: Optional[int] = None

# AI Recommendation Request
class RecommendationRequest(BaseModel):
    email: str
    health_data: HealthData
    recent_workouts: List[WorkoutData] = []
    question: Optional[str] = None

# Chat Request
class ChatRequest(BaseModel):
    email: str
    message: str
    conversation_history: List[dict] = []

# AI Response
class AIResponse(BaseModel):
    response: str
    recommendations: Optional[List[str]] = None
    tips: Optional[List[str]] = None