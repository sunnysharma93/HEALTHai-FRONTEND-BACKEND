# 🏋️ HealthAI — Production Grade AI Health Backend

A production-ready microservices-based health and fitness platform powered by **Spring Boot**, **Python FastAPI**, **Gemini AI**, **Kafka**, **Redis**, and **Docker**.

---

## 🏗️ System Architecture

```
Client Request
      ↓
Java Backend (8081)     ← Auth + User + Workout Services
      ↓
┌─────────────────────────────────────┐
│  MySQL   → Persistent Storage       │
│  Redis   → Caching + Blacklisting   │
│  Kafka   → Event Streaming          │
└─────────────────────────────────────┘
      ↓
Python AI Service (8085) ← Gemini + LangChain + RAG
```

---

## 🚀 Features

### Module 1 — Auth Service
- ✅ JWT Access Token (15 min expiry)
- ✅ Refresh Token System (7 days)
- ✅ Redis Token Blacklisting (Logout)
- ✅ Rate Limiting (5 requests/min per IP)
- ✅ BCrypt Password Encryption
- ✅ DTO Pattern
- ✅ Global Exception Handling
- ✅ Role-Based Access Control (RBAC)

### Module 2 — User Service
- ✅ User Profile Management
- ✅ Health Profile (Weight, Height, BMI)
- ✅ Auto BMI Calculation
- ✅ Daily Calorie Target Calculation
- ✅ Redis Profile Caching (10 min TTL)
- ✅ Cache Invalidation on Update

### Module 3 — Workout Service
- ✅ Workout Logging (Exercise, Sets, Reps, Duration)
- ✅ Auto Calories Burned Calculation
- ✅ Today's Workouts
- ✅ Workout History
- ✅ Stats (Total workouts, calories, streak)
- ✅ Progress Tracking (Date range)
- ✅ Redis Stats Caching (30 min TTL)
- ✅ Streak Calculation

### Module 4 — AI Service (Python)
- ✅ FastAPI REST APIs
- ✅ Gemini 2.0 Flash Integration
- ✅ LangChain Prompt Management
- ✅ ChromaDB Vector Database
- ✅ RAG (Retrieval Augmented Generation)
- ✅ Personalized AI Recommendations
- ✅ Fitness AI Chat
- ✅ Kafka Event Consumer

### Module 5 — Docker Compose
- ✅ MySQL 8.0
- ✅ Redis 7
- ✅ Apache Kafka
- ✅ Java Backend Container
- ✅ Python AI Service Container
- ✅ One command deployment

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Spring Boot 3.x | Java Backend Framework |
| Spring Security 6 | Authentication & Authorization |
| JWT (jjwt 0.11.5) | Token Generation |
| Redis | Caching + Token Blacklisting |
| Apache Kafka | Event Streaming |
| MySQL 8.0 | Primary Database |
| FastAPI | Python AI Service |
| Gemini 2.0 Flash | LLM Integration |
| LangChain | Prompt Management |
| ChromaDB | Vector Database (RAG) |
| Docker + Compose | Containerization |
| Bucket4j | Rate Limiting |
| Lombok | Boilerplate Reduction |

---

## 📁 Project Structure

```
HEALTHAI/
│
├── HealthAi/                          ← Java Spring Boot Backend
│   ├── src/main/java/com/HealthAi/
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   └── RedisConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── UserController.java
│   │   │   └── WorkoutController.java
│   │   ├── dto/
│   │   │   ├── RegisterRequest.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   ├── HealthProfileRequest.java
│   │   │   ├── UserProfileResponse.java
│   │   │   ├── WorkoutRequest.java
│   │   │   ├── WorkoutResponse.java
│   │   │   ├── WorkoutStatsResponse.java
│   │   │   └── ProgressResponse.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── RefreshToken.java
│   │   │   ├── HealthProfile.java
│   │   │   ├── Exercise.java
│   │   │   └── WorkoutLog.java
│   │   ├── exception/
│   │   │   ├── CustomException.java
│   │   │   ├── ErrorResponse.java
│   │   │   └── GlobalExceptionHandler.java
│   │   ├── filter/
│   │   │   ├── JwtFilter.java
│   │   │   └── RateLimitFilter.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── RefreshTokenRepository.java
│   │   │   ├── HealthProfileRepository.java
│   │   │   ├── ExerciseRepository.java
│   │   │   └── WorkoutLogRepository.java
│   │   └── service/
│   │       ├── UserService.java
│   │       ├── JwtService.java
│   │       ├── RefreshTokenService.java
│   │       ├── TokenBlackListService.java
│   │       ├── UserProfileService.java
│   │       ├── UserCacheService.java
│   │       ├── WorkoutService.java
│   │       ├── WorkoutStatsService.java
│   │       └── WorkoutCacheService.java
│   └── Dockerfile
│
├── healthai-ai-service/               ← Python FastAPI AI Service
│   ├── main.py
│   ├── config/
│   │   └── settings.py
│   ├── routes/
│   │   ├── recommendation.py
│   │   └── chat.py
│   ├── services/
│   │   ├── gemini_service.py
│   │   ├── langchain_service.py
│   │   └── rag_service.py
│   ├── models/
│   │   └── schemas.py
│   ├── event_consumer/
│   │   └── consumer.py
│   ├── requirements.txt
│   └── Dockerfile
│
└── docker-compose.yml                 ← One command deployment
```

---

## ⚙️ Setup & Run

### Prerequisites
- Java 21
- Maven
- Python 3.11+
- Docker + Docker Compose
- Gemini API Key ([Get here](https://aistudio.google.com/app/apikey))

### Quick Start (Docker)

```bash
# 1. Clone karo
git clone https://github.com/sunnysharma93/HEALTHai-FRONTEND-BACKEND.git
cd HEALTHai-FRONTEND-BACKEND

# 2. .env file banao
echo "GEMINI_API_KEY=your_key_here" > .env

# 3. Java build karo
cd HealthAi
mvn clean package -DskipTests
cd ..

# 4. Sab ek saath chalao!
docker-compose up --build
```

### Local Development

```bash
# Java Backend
cd HealthAi
mvn spring-boot:run

# Python AI Service
cd healthai-ai-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

---

## 📬 API Endpoints

### Auth Service (Port 8081)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | User register | ❌ |
| POST | `/auth/login` | Login + Token | ❌ |
| POST | `/auth/refresh` | Refresh token | ❌ |
| POST | `/auth/logout` | Logout | ✅ |
| GET | `/auth/profile` | Basic profile | ✅ |

### User Service (Port 8081)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/user/profile` | Full profile + health | ✅ |
| POST | `/user/health` | Save health data | ✅ |
| PUT | `/user/profile` | Update name | ✅ |

### Workout Service (Port 8081)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/workout/log` | Log workout | ✅ |
| GET | `/workout/today` | Today's workouts | ✅ |
| GET | `/workout/all` | All workouts | ✅ |
| GET | `/workout/stats` | Stats + Streak | ✅ |
| GET | `/workout/progress` | Date range progress | ✅ |
| DELETE | `/workout/{id}` | Delete workout | ✅ |

### AI Service (Port 8085)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/recommend` | AI Recommendation |
| POST | `/ai/chat` | Fitness Chat |
| GET | `/ai/health-tips/{goal}` | Goal based tips |
| GET | `/docs` | Swagger UI |

---

## 📝 Sample Requests

### Register
```json
POST http://localhost:8081/auth/register
{
    "name": "Sunny Sharma",
    "email": "sunny@gmail.com",
    "password": "123456"
}
```

### Login
```json
POST http://localhost:8081/auth/login
{
    "email": "sunny@gmail.com",
    "password": "123456"
}
```

### Save Health Profile
```json
POST http://localhost:8081/user/health
Authorization: Bearer <token>
{
    "weight": 75.0,
    "height": 175.0,
    "age": 25,
    "gender": "MALE",
    "activityLevel": "ACTIVE",
    "goal": "LOSE_WEIGHT"
}
```

### Log Workout
```json
POST http://localhost:8081/workout/log
Authorization: Bearer <token>
{
    "exerciseId": 1,
    "sets": 3,
    "reps": 15,
    "durationMins": 10,
    "notes": "Felt great!"
}
```

### AI Recommendation
```json
POST http://localhost:8085/ai/recommend
{
    "email": "sunny@gmail.com",
    "health_data": {
        "weight": 75.0,
        "height": 175.0,
        "age": 25,
        "gender": "MALE",
        "activity_level": "ACTIVE",
        "goal": "LOSE_WEIGHT",
        "bmi": 24.5,
        "daily_calorie_target": 2200
    },
    "question": "Weight loss ke liye best workout plan?"
}
```

---

## 🔒 Security Flow

```
Register → BCrypt encrypt → DB save

Login    → Credentials verify
         → Access Token (15 min)
         → Refresh Token (7 days, DB mein)

Request  → JwtFilter check
         → Redis blacklist check
         → Valid → Access ✅
         → Invalid → 401 ❌

Logout   → Token Redis mein blacklist
         → Refresh Token delete
         → Same token kaam nahi karta ❌

Rate     → 5 req/min per IP
Limit    → Exceed → 429 ❌
```

---

## 🤖 AI Flow

```
POST /ai/recommend →
  RAG → ChromaDB se relevant knowledge lo
  LangChain → Prompt banao (user data + knowledge)
  Gemini → Personalized response generate karo
  Return → Recommendations + Tips ✅

Kafka Consumer →
  workout-logged event uthao
  ChromaDB mein user data save karo
  Future recommendations mein use hoga
```

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Redis connection refused | `docker-compose up` se chalao |
| JWT WeakKeyException | Secret 256 bits se bada hona chahiye |
| Circular Dependency | `@Lazy` annotation use karo |
| TransactionRequiredException | `@Transactional` add karo |
| Port already in use | Local service band karo |
| Java version mismatch | Dockerfile mein Java 21 use karo |

---

## 🏆 Achievements

- ✅ Production-grade JWT Auth with Refresh Tokens
- ✅ Redis Caching reducing DB load by ~70%
- ✅ Auto BMI + Calorie calculation
- ✅ Streak tracking algorithm
- ✅ RAG-powered personalized AI recommendations
- ✅ Full Docker containerization
- ✅ Polyglot architecture (Java + Python)

---

## 👨‍💻 Developer

**Sunny Sharma**
- GitHub: [github.com/sunnysharma93](https://github.com/sunnysharma93)
- LinkedIn: [linkedin.com/in/sunny-sharma93](https://linkedin.com/in/sunny-sharma93)
- Email: sunnysharma.org1@gmail.com

---

## 📄 License

MIT License — Feel free to use this project for learning and portfolio purposes.
