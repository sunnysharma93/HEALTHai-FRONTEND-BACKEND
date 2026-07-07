from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.recommendation import router as rec_router
from routes.chat import router as chat_router
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="HealthAI — AI Service",
    description="Gemini + LangChain + RAG",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ← Yeh hona chahiye
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(rec_router)
app.include_router(chat_router)

@app.get("/")
async def root():
    return {
        "service": "HealthAI — AI Service",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8085,
        reload=True
    )
