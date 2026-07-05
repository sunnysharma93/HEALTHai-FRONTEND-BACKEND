# HealthAI Backend — Module 1: Auth Service

Production-grade JWT Authentication System built with Spring Boot 3.x

## 🚀 Features

- JWT Access Token (15 min expiry)
- Refresh Token System (7 days expiry)
- Redis Token Blacklisting (Logout)
- Rate Limiting (5 requests/min per IP)
- BCrypt Password Encryption
- DTO Pattern (Safe data transfer)
- Global Exception Handling
- Role-Based Access Control (RBAC)

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Spring Boot 3.x | Backend Framework |
| Spring Security 6 | Authentication & Authorization |
| JWT (jjwt 0.11.5) | Token Generation |
| Redis | Token Blacklisting + Caching |
| MySQL | User & Token Storage |
| Bucket4j | Rate Limiting |
| Docker | Redis Container |
| Lombok | Boilerplate Reduction |

## 📁 Project Structure

```
src/main/java/com/HealthAi/
│
├── config/
│   ├── SecurityConfig.java
│   └── RedisConfig.java
│
├── controller/
│   └── AuthController.java
│
├── dto/
│   ├── RegisterRequest.java
│   ├── LoginRequest.java
│   └── AuthResponse.java
│
├── entity/
│   ├── User.java
│   └── RefreshToken.java
│
├── exception/
│   ├── CustomException.java
│   ├── ErrorResponse.java
│   └── GlobalExceptionHandler.java
│
├── filter/
│   ├── JwtFilter.java
│   └── RateLimitFilter.java
│
├── repository/
│   ├── UserRepository.java
│   └── RefreshTokenRepository.java
│
└── service/
    ├── UserService.java
    ├── JwtService.java
    ├── RefreshTokenService.java
    └── TokenBlackListService.java
```

## ⚙️ Setup & Run

### Prerequisites
- Java 17
- Maven
- MySQL
- Docker

### Step 1 — Redis Start karo
```bash
docker run -d --name redis -p 6379:6379 redis
```

### Step 2 — MySQL Database banao
```sql
CREATE DATABASE healthai;
```

### Step 3 — application.properties configure karo
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/healthai
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update

jwt.secret=your-256-bit-secret-key-base64-encoded
jwt.expiration=900000

spring.redis.host=localhost
spring.redis.port=6379
```

### Step 4 — Run karo
```bash
mvn spring-boot:run
```

## 📬 API Endpoints

### Register
```
POST /auth/register
Content-Type: application/json

{
    "name": "Sunny Sharma",
    "email": "sunny@gmail.com",
    "password": "123456"
}

Response: "User register ho gaya!"
```

### Login
```
POST /auth/login
Content-Type: application/json

{
    "email": "sunny@gmail.com",
    "password": "123456"
}

Response:
{
    "accessToken": "eyJhbGci...",
    "refreshToken": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "email": "sunny@gmail.com",
    "name": "Sunny Sharma"
}
```

### Profile (Protected)
```
GET /auth/profile
Authorization: Bearer eyJhbGci...

Response: "Welcome sunny@gmail.com! Yeh tera profile hai."
```

### Refresh Token
```
POST /auth/refresh
Content-Type: application/json

"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

Response:
{
    "accessToken": "eyJhbGci...(new)",
    "refreshToken": "xxxxxxxx-...",
    "email": "sunny@gmail.com",
    "name": "Sunny Sharma"
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer eyJhbGci...

Response: "Logout ho gaya!"
```

## 🔒 Security Flow

```
Register → Password BCrypt encrypt → DB save

Login    → Credentials verify
         → Access Token (15 min)
         → Refresh Token (7 days)

Request  → JwtFilter token check
         → Redis blacklist check
         → Valid → Access granted ✅
         → Invalid → 401 ❌

Logout   → Token Redis blacklist mein
         → Refresh Token DB se delete
         → Same token dobara kaam nahi karta ❌

Rate     → 5 requests/min per IP
Limit    → Exceed karo → 429 Too Many Requests
```

## 🐛 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| WeakKeyException | JWT secret 256 bits se bada hona chahiye |
| RedisConnectionFailure | Docker pe Redis start karo |
| Circular Dependency | @Lazy annotation use karo |
| TransactionRequiredException | @Transactional add karo |

## 🔮 Next Module

Module 2 — User Service with Redis Caching
- User Profile Management
- Health Data Tracking  
- Redis Caching (Performance)
- Kafka Events
