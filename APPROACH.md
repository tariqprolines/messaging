# Messaging Portal - Development Approach

## Project Overview
A messaging portal where clients can send messages to their own clients using a third-party message provider service.

## Technology Stack

### Backend
- **FastAPI** - Modern, fast Python web framework for building APIs
- **PostgreSQL** - Relational database for persistent data storage
- **Redis** - In-memory data store for caching and queue management
- **Celery/RQ** - Distributed task queue for background job processing

### Frontend
- **React** - JavaScript library for building user interfaces

## Architecture Overview (Microservices)

The system is designed as separate microservices with clear service boundaries:

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND SERVICE                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Application (Port: 3000)                      │   │
│  │  - Independent service                               │   │
│  │  - Serves static assets                              │   │
│  │  - Communicates via REST API                         │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/REST API
                        │ (CORS enabled)
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    BACKEND SERVICE                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  FastAPI Application (Port: 8000)                    │   │
│  │  - Independent service                               │   │
│  │  - RESTful API endpoints                             │   │
│  │  - JWT authentication                                │   │
│  └───────────────────────┬──────────────────────────────┘   │
│                          │                                   │
│    ┌─────────────────────┼──────────┬──────────┐            │
│    │                     │          │          │            │
│  ┌─▼──────┐         ┌────▼──┐  ┌───▼────┐ ┌───▼────┐       │
│  │PostgreSQL│       │ Redis │  │ Celery │ │Message│       │
│  │          │       │       │  │ Workers│ │Provider│       │
│  │          │       │       │  │        │ │   API  │       │
│  └──────────┘       └───────┘  └────────┘ └────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Microservices Principles

1. **Service Independence**
   - Frontend and Backend are completely separate services
   - Each service has its own repository, deployment pipeline, and scaling
   - Services communicate only via well-defined APIs

2. **Service Boundaries**
   - **Frontend Service**: UI/UX, client-side logic, API communication
   - **Backend Service**: Business logic, data persistence, external integrations

3. **Communication**
   - RESTful API between services
   - Stateless communication (JWT tokens)
   - CORS configured for cross-origin requests

## Project Structure (Microservices)

Each service is completely independent with its own structure, dependencies, and deployment:

```
messaging/
│
├── backend/                        # BACKEND MICROSERVICE
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI application entry point
│   │   ├── config.py               # Configuration management
│   │   ├── database.py             # Database connection & session
│   │   ├── redis_client.py         # Redis connection
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── deps.py             # Dependency injection
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── auth.py         # Authentication endpoints (signup, login, refresh, reset)
│   │   │       ├── clients.py      # Client management
│   │   │       ├── messages.py     # Message sending endpoints
│   │   │       └── webhooks.py     # Webhook handlers
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── security.py         # JWT, password hashing
│   │   │   ├── config.py           # Settings
│   │   │   ├── exceptions.py       # Custom exceptions
│   │   │   └── cors.py             # CORS configuration
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py             # User model
│   │   │   ├── client.py           # Client model
│   │   │   ├── message.py          # Message model
│   │   │   └── template.py         # Message template model
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py             # Pydantic schemas
│   │   │   ├── client.py
│   │   │   ├── message.py
│   │   │   └── template.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── message_provider.py # Third-party message service integration
│   │   │   ├── message_service.py  # Business logic for messages
│   │   │   ├── client_service.py   # Client management logic
│   │   │   └── notification_service.py # Notification handling
│   │   ├── tasks/
│   │   │   ├── __init__.py
│   │   │   ├── celery_app.py       # Celery app configuration
│   │   │   ├── send_message.py     # Background task for sending
│   │   │   ├── retry_failed.py     # Retry failed messages
│   │   │   └── webhook_processor.py # Process webhook callbacks
│   │   └── migrations/             # Alembic migrations
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_api/
│   │   ├── test_services/
│   │   └── test_tasks/
│   ├── requirements.txt            # Backend dependencies
│   ├── .env.example                # Backend environment variables
│   ├── Dockerfile                  # Backend container
│   ├── docker-compose.backend.yml  # Backend service compose
│   ├── .dockerignore
│   └── README.md                   # Backend service documentation
│
├── frontend/                       # FRONTEND MICROSERVICE
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/             # Reusable components
│   │   │   ├── messages/           # Message-related components
│   │   │   ├── clients/            # Client management components
│   │   │   └── dashboard/          # Dashboard components
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Signup.jsx           # Client signup/registration page
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── Clients.jsx          # Client contact management
│   │   │   ├── Messages.jsx         # Message sending interface
│   │   │   └── Templates.jsx        # Message templates
│   │   ├── services/
│   │   │   ├── api.js              # API client (connects to backend)
│   │   │   └── auth.js             # Authentication service
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useMessages.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   └── config.js           # Frontend configuration
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json                # Frontend dependencies
│   ├── .env.example                # Frontend environment variables
│   ├── Dockerfile                  # Frontend container
│   ├── docker-compose.frontend.yml # Frontend service compose
│   ├── .dockerignore
│   ├── nginx.conf                  # Nginx config for production
│   └── README.md                   # Frontend service documentation
│
├── docker-compose.yml              # Orchestration for all services
├── docker-compose.dev.yml          # Development environment
├── docker-compose.prod.yml         # Production environment
├── .env.example                    # Shared environment variables
├── .gitignore
└── README.md                       # Project overview
```

### Microservices Structure Notes

- **Independent Repositories**: Each service can be in its own repository
- **Independent Deployment**: Services can be deployed separately
- **Service-Specific Configuration**: Each service has its own `.env` and config files
- **Containerization**: Each service has its own Dockerfile
- **Service Health Checks**: Each service exposes health check endpoints

## Database Schema Design

### Core Tables

1. **users** - Portal users (clients who use the portal)
   - id, email, hashed_password, company_name, created_at, updated_at

2. **client_contacts** - End clients (recipients of messages)
   - id, user_id (FK), name, phone, email, metadata, created_at

3. **messages** - Message records
   - id, user_id (FK), client_contact_id (FK), provider_message_id, 
    status, content, message_type, sent_at, delivered_at, failed_at, error_message

4. **message_templates** - Reusable message templates
   - id, user_id (FK), name, content, variables, created_at

5. **webhook_events** - Webhook callbacks from message provider
   - id, message_id (FK), event_type, payload, processed_at

## Implementation Phases

### Phase 1: Backend Foundation
1. Set up FastAPI project structure
2. Configure PostgreSQL database with SQLAlchemy
3. Set up Redis connection
4. Configure Celery/RQ for background tasks
5. Implement authentication (JWT)
6. Create database models and migrations

### Phase 2: Core API Development
1. **Authentication endpoints**
   - User signup/registration (`POST /api/v1/auth/signup`)
   - User login (`POST /api/v1/auth/login`)
   - Token refresh (`POST /api/v1/auth/refresh`)
   - Password reset (`POST /api/v1/auth/reset-password`)
2. User management endpoints
3. Client contact management endpoints
4. Message sending API (synchronous)
5. Message status tracking
6. Template management

### Phase 3: Message Provider Integration
1. Create message provider service adapter
2. Implement message sending logic
3. Handle provider-specific authentication
4. Implement retry logic for failed messages
5. Webhook handling for delivery status

### Phase 4: Background Job Processing
1. Set up Celery/RQ workers
2. Implement async message sending tasks
3. Retry mechanism for failed messages
4. Status update tasks
5. Webhook processing tasks

### Phase 5: Frontend Development
1. Set up React project
2. **Implement authentication UI**
   - Signup/Registration page (`/signup`)
   - Login page (`/login`)
   - Password reset page (`/reset-password`)
   - Protected route wrapper
3. Dashboard with message statistics
4. Client contact management UI
5. Message sending interface
6. Message history and status view
7. Template management UI

### Phase 6: Integration & Testing
1. End-to-end testing
2. Error handling and edge cases
3. Performance optimization
4. Security audit
5. Documentation

## Key Design Decisions

### 1. Client Signup/Registration Flow
- **Signup Endpoint**: `POST /api/v1/auth/signup`
  - Accepts: email, password, company_name
  - Validates email uniqueness
  - Hashes password before storage
  - Returns: JWT access token and refresh token
  - Creates new user in `users` table

- **Signup UI**: `/signup` page in React
  - Form fields: Email, Password, Confirm Password, Company Name
  - Client-side validation
  - Error handling for duplicate emails
  - Redirects to dashboard on success
  - Link to login page for existing users

- **Authentication Flow**:
  1. User fills signup form
  2. Frontend sends POST to `/api/v1/auth/signup`
  3. Backend validates and creates user
  4. Backend returns JWT tokens
  5. Frontend stores tokens and redirects to dashboard

### 2. Message Sending Flow
- **Synchronous**: For immediate feedback (small batches)
- **Asynchronous**: For bulk sending (via Celery/RQ)
- Messages are queued in Redis before processing

### 2. Status Tracking
- Initial: `pending` → `queued` → `sending` → `sent` → `delivered`/`failed`
- Webhooks from provider update status asynchronously

### 4. Error Handling
- Retry mechanism with exponential backoff
- Dead letter queue for permanently failed messages
- Comprehensive logging for debugging

### 5. Security
- JWT-based authentication
- Rate limiting per user
- Input validation on all endpoints
- SQL injection prevention (ORM)
- CORS configuration for cross-origin requests (frontend → backend)
- Service-to-service authentication (if needed)
- HTTPS in production

### 6. Scalability
- Stateless API design
- Horizontal scaling of workers
- Database connection pooling
- Redis for caching and session management
- Independent scaling of frontend and backend services
- Load balancing for both services

### 7. Microservices Communication
- **API Contract**: Well-defined REST API between services
- **CORS**: Backend configured to accept requests from frontend origin
- **Service Discovery**: Environment-based service URLs
- **Health Checks**: Each service exposes `/health` endpoint
- **API Versioning**: Versioned API endpoints (`/api/v1/`)
- **Error Handling**: Consistent error response format

## Environment Variables

### Backend Service (.env)

```env
# Service Configuration
SERVICE_NAME=messaging-backend
SERVICE_PORT=8000
ENVIRONMENT=development

# Database
DATABASE_URL=postgresql://user:password@postgres:5432/messaging_db
DATABASE_POOL_SIZE=10

# Redis
REDIS_URL=redis://redis:6379/0
REDIS_CACHE_TTL=3600

# Celery
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
CELERY_TASK_SERIALIZER=json
CELERY_RESULT_SERIALIZER=json

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
CORS_ALLOW_CREDENTIALS=true
CORS_ALLOW_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOW_HEADERS=Content-Type,Authorization

# Message Provider
MESSAGE_PROVIDER_API_KEY=your-api-key
MESSAGE_PROVIDER_API_URL=https://api.provider.com
MESSAGE_PROVIDER_WEBHOOK_SECRET=webhook-secret
MESSAGE_PROVIDER_TIMEOUT=30

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json

# Health Check
HEALTH_CHECK_ENABLED=true
```

### Frontend Service (.env)

```env
# Service Configuration
SERVICE_NAME=messaging-frontend
SERVICE_PORT=3000
ENVIRONMENT=development

# Backend API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_VERSION=v1
REACT_APP_API_TIMEOUT=30000

# Application Configuration
REACT_APP_NAME=Messaging Portal
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG=true

# Build Configuration
GENERATE_SOURCEMAP=true
```

### Shared Services (docker-compose)

```env
# PostgreSQL
POSTGRES_DB=messaging_db
POSTGRES_USER=messaging_user
POSTGRES_PASSWORD=messaging_password
POSTGRES_PORT=5432

# Redis
REDIS_PORT=6379
REDIS_PASSWORD=
```

## Docker Compose Configuration

### Development (docker-compose.dev.yml)

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: messaging-postgres
    environment:
      POSTGRES_DB: messaging_db
      POSTGRES_USER: messaging_user
      POSTGRES_PASSWORD: messaging_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U messaging_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis
  redis:
    image: redis:7-alpine
    container_name: messaging-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend Service
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: messaging-backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://messaging_user:messaging_password@postgres:5432/messaging_db
      - REDIS_URL=redis://redis:6379/0
      - CELERY_BROKER_URL=redis://redis:6379/0
      - CORS_ORIGINS=http://localhost:3000
    volumes:
      - ./backend:/app
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Celery Worker
  celery-worker:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: messaging-celery-worker
    environment:
      - DATABASE_URL=postgresql://messaging_user:messaging_password@postgres:5432/messaging_db
      - REDIS_URL=redis://redis:6379/0
      - CELERY_BROKER_URL=redis://redis:6379/0
    volumes:
      - ./backend:/app
    depends_on:
      - postgres
      - redis
      - backend
    command: celery -A app.tasks.celery_app worker --loglevel=info

  # Frontend Service
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: messaging-frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    command: npm start
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
  redis_data:
```

### Production (docker-compose.prod.yml)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - messaging-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - messaging-network
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - CELERY_BROKER_URL=${CELERY_BROKER_URL}
      - CORS_ORIGINS=${CORS_ORIGINS}
    networks:
      - messaging-network
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    deploy:
      replicas: 2

  celery-worker:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - CELERY_BROKER_URL=${CELERY_BROKER_URL}
    networks:
      - messaging-network
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    deploy:
      replicas: 2

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      - REACT_APP_API_URL=${REACT_APP_API_URL}
    networks:
      - messaging-network
    depends_on:
      - backend
    restart: unless-stopped
    deploy:
      replicas: 2

volumes:
  postgres_data:
  redis_data:

networks:
  messaging-network:
    driver: bridge
```

## Development Workflow (Microservices)

### 1. Local Development

#### Option A: Docker Compose (Recommended)
```bash
# Start all services (backend, frontend, PostgreSQL, Redis)
docker-compose -f docker-compose.dev.yml up

# Start specific service
docker-compose -f docker-compose.dev.yml up backend
docker-compose -f docker-compose.dev.yml up frontend
```

#### Option B: Individual Service Development
```bash
# Backend Service
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend Service
cd frontend
npm install
npm start  # Runs on http://localhost:3000

# Celery Workers (separate terminal)
cd backend
celery -A app.tasks.celery_app worker --loglevel=info
```

### 2. Service Communication

- **Frontend → Backend**: Frontend makes HTTP requests to backend API
- **Backend → Database**: Direct connection to PostgreSQL
- **Backend → Redis**: Direct connection for queue and cache
- **Backend → Message Provider**: External API calls

### 3. Testing

#### Backend Testing
```bash
cd backend
pytest tests/ -v
pytest tests/test_api/ -v
pytest tests/test_services/ -v
```

#### Frontend Testing
```bash
cd frontend
npm test
npm run test:coverage
```

#### Integration Testing
- Test API endpoints with frontend integration
- Test message sending flow end-to-end
- Test authentication flow

### 4. Deployment (Microservices)

#### Independent Deployment
Each service can be deployed independently:

**Backend Service:**
```bash
# Build backend image
docker build -t messaging-backend:latest ./backend

# Run backend service
docker run -d \
  --name messaging-backend \
  -p 8000:8000 \
  --env-file backend/.env \
  messaging-backend:latest
```

**Frontend Service:**
```bash
# Build frontend image
docker build -t messaging-frontend:latest ./frontend

# Run frontend service
docker run -d \
  --name messaging-frontend \
  -p 3000:80 \
  --env-file frontend/.env \
  messaging-frontend:latest
```

#### Orchestrated Deployment
```bash
# Deploy all services together
docker-compose -f docker-compose.prod.yml up -d
```

### 5. Service Health Checks

**Backend Health Endpoint:**
```
GET /health
Response: {"status": "healthy", "service": "backend", "version": "1.0.0"}
```

**Frontend Health Endpoint:**
```
GET /health
Response: {"status": "healthy", "service": "frontend", "version": "1.0.0"}
```

### 6. Monitoring & Logging

- Each service logs independently
- Centralized logging (optional): ELK stack, Loki, etc.
- Service metrics: Prometheus + Grafana
- API monitoring: Track request/response times, error rates

## Microservices Best Practices

### 1. Service Independence
- Each service has its own codebase, dependencies, and deployment pipeline
- Services can be developed by different teams
- Services can use different technologies (if needed in future)

### 2. API Design
- RESTful API with versioning (`/api/v1/`)
- Consistent error response format
- API documentation (OpenAPI/Swagger)
- Rate limiting and throttling

### 3. Data Management
- Each service owns its data (Backend owns PostgreSQL)
- No direct database access from frontend
- Data consistency through API contracts

### 4. Communication Patterns
- Synchronous: HTTP/REST for frontend-backend communication
- Asynchronous: Message queue (Redis/Celery) for background tasks
- Event-driven: Webhooks for external service callbacks

### 5. Security
- CORS configured for frontend origin only
- JWT tokens for authentication
- API keys for external service integration
- Input validation and sanitization

### 6. Scalability
- Horizontal scaling: Each service can scale independently
- Load balancing: Multiple instances of each service
- Database connection pooling
- Caching strategy with Redis

## Next Steps

1. **Initialize Backend Service**
   - Set up FastAPI project structure
   - Configure PostgreSQL and Redis connections
   - Set up Celery workers
   - Implement health check endpoint

2. **Initialize Frontend Service**
   - Set up React project
   - Configure API client
   - Set up routing and authentication context

3. **Set Up Development Environment**
   - Create docker-compose files
   - Configure environment variables
   - Set up service communication

4. **Implement Core Features**
   - Backend: Authentication, message sending API
   - Frontend: Login, dashboard, message interface

5. **Integration & Testing**
   - Test service-to-service communication
   - End-to-end testing
   - Performance testing

6. **Deployment**
   - Containerize both services
   - Set up CI/CD pipelines
   - Configure production environment
