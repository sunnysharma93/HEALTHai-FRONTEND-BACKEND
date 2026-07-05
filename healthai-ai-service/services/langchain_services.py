from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from services.rag_service import rag_service
from config.settings import settings
from models.schemas import RecommendationRequest
import logging

logger = logging.getLogger(__name__)

class LangChainService:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0.7
        )

        # Recommendation prompt template
        self.recommendation_prompt = PromptTemplate(
            input_variables=[
                "user_data",
                "workout_history",
                "knowledge_base",
                "question"
            ],
            template="""
Tu ek expert fitness trainer aur nutritionist hai.
User ke data ke basis pe personalized advice do.

USER HEALTH DATA:
{user_data}

RECENT WORKOUT HISTORY:
{workout_history}

RELEVANT FITNESS KNOWLEDGE:
{knowledge_base}

USER QUESTION: {question}

Hinglish mein friendly aur practical advice do.
Response structure:
1. Direct answer (2-3 lines)
2. Specific recommendations (3-5 points)
3. Quick tips (2-3 points)
4. Motivational message

Practical aur actionable advice do — complex terms avoid karo.
"""
        )

        self.chain = LLMChain(
            llm=self.llm,
            prompt=self.recommendation_prompt
        )

        logger.info("LangChain service initialized!")

    def get_recommendation(
            self, request: RecommendationRequest) -> dict:
        try:
            # User data format karo
            health = request.health_data
            user_data = f"""
- Weight: {health.weight}kg
- Height: {health.height}cm
- Age: {health.age} years
- Gender: {health.gender}
- Activity Level: {health.activity_level}
- Goal: {health.goal}
- BMI: {health.bmi}
- Daily Calorie Target: {health.daily_calorie_target}
"""

            # Workout history format karo
            if request.recent_workouts:
                workout_history = "\n".join([
                    f"- {w.exercise_name} ({w.category}): "
                    f"{w.duration_mins} min, "
                    f"{w.calories_burned} cal"
                    for w in request.recent_workouts
                ])
            else:
                workout_history = "Koi recent workout nahi"

            # RAG se relevant knowledge lo
            query = f"{health.goal} {health.activity_level} fitness advice"
            knowledge = rag_service.search(query, n_results=4)
            knowledge_base = "\n".join(knowledge)

            question = request.question or \
                       "Mere goal ke liye best workout aur diet plan kya hoga?"

            # LangChain se response lo
            response = self.chain.invoke({
                "user_data": user_data,
                "workout_history": workout_history,
                "knowledge_base": knowledge_base,
                "question": question
            })

            ai_response = response['text']

            # Response parse karo
            lines = ai_response.split('\n')
            recommendations = [
                l for l in lines
                if l.strip().startswith(('•', '-', '*', '2.'))
            ][:5]
            tips = [
                l for l in lines
                if 'tip' in l.lower() or l.strip().startswith('3.')
            ][:3]

            return {
                "response": ai_response,
                "recommendations": recommendations,
                "tips": tips
            }

        except Exception as e:
            logger.error(f"Recommendation error: {e}")
            return {
                "response": "Recommendation generate nahi ho saka!",
                "recommendations": [],
                "tips": []
            }

# Singleton
langchain_service = LangChainService()