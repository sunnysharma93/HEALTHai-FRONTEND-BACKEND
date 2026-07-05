import chromadb
from chromadb.utils import embedding_functions
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        # ChromaDB client
        self.client = chromadb.PersistentClient(
            path=settings.CHROMA_DB_PATH)

        # Embedding function — text ko vectors mein convert
        self.embedding_fn = embedding_functions \
            .DefaultEmbeddingFunction()

        # Collection banao — fitness knowledge base
        self.collection = self.client.get_or_create_collection(
            name="fitness_knowledge",
            embedding_function=self.embedding_fn
        )

        # Knowledge base seed karo
        self._seed_knowledge_base()
        logger.info("RAG service initialized!")

    def _seed_knowledge_base(self):
        # Agar already data hai toh skip karo
        if self.collection.count() > 0:
            return

        # Fitness knowledge base
        documents = [
            "Weight loss ke liye calorie deficit zaroori hai. "
            "Daily 500 calories kam khao aur cardio karo.",

            "Muscle gain ke liye protein intake badhaao. "
            "Body weight ke per kg 1.6-2.2g protein chahiye.",

            "HIIT training fat burn ke liye best hai. "
            "20-30 min HIIT = 1 hour normal cardio.",

            "Progressive overload se muscle grow hoti hai. "
            "Har week weight ya reps badhaate raho.",

            "Rest days utni hi important hain jitni workout. "
            "Muscle repair rest mein hoti hai, workout mein nahi.",

            "Compound exercises jaise squat, deadlift, bench press "
            "ek saath multiple muscles work karte hain.",

            "Cardio aur strength training dono zaroori hain "
            "overall fitness ke liye.",

            "Hydration bahut important hai workout ke dauran. "
            "Per hour 500-750ml paani peeyo.",

            "Pre-workout meal mein carbs aur protein lena chahiye. "
            "Workout se 1-2 ghante pehle khao.",

            "Post-workout 30 min mein protein lena muscle recovery "
            "ke liye best hai.",

            "Beginner ke liye week mein 3-4 din workout enough hai. "
            "Overtraining se injury ho sakti hai.",

            "BMI 18.5-24.9 normal range hai. "
            "25-29.9 overweight, 30+ obese category hai.",

            "Sleep aur fitness directly connected hain. "
            "7-9 ghante neend muscle recovery ke liye zaroori hai.",

            "Stretching injury prevention ke liye important hai. "
            "Workout se pehle dynamic, baad mein static stretching.",

            "Core strength sab exercises ka base hoti hai. "
            "Plank, crunch, leg raise core strengthen karte hain.",
        ]

        # IDs generate karo
        ids = [f"doc_{i}" for i in range(len(documents))]

        # ChromaDB mein add karo
        self.collection.add(
            documents=documents,
            ids=ids
        )
        logger.info(
            f"Knowledge base seeded: {len(documents)} docs")

    def search(self, query: str, n_results: int = 3) -> list:
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results
            )
            return results['documents'][0]
        except Exception as e:
            logger.error(f"RAG search error: {e}")
            return []

    def add_user_data(self, email: str, data: str):
        try:
            # User specific data add karo
            self.collection.upsert(
                documents=[data],
                ids=[f"user_{email}_{hash(data)}"]
            )
        except Exception as e:
            logger.error(f"Add data error: {e}")

# Singleton
rag_service = RAGService()