# Messaging Portal

A microservices-based messaging portal where clients can send messages to their own clients using a third-party message provider service.

## Architecture

- **messaging-backend**: FastAPI backend service
- **messaging-frontend**: React frontend service
- **PostgreSQL**: Primary database
- **Redis**: Queue and caching
- **Celery**: Background job processing

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local backend development)
- Node.js 18+ (for local frontend development)

### Using Docker Compose (Recommended)

**Important**: Run all docker-compose commands from the project root directory (`/var/www/html/messaging`)

1. Navigate to project root:
```bash
cd /var/www/html/messaging
```

2. Start all services:
```bash
docker-compose -f docker-compose.dev.yml up
```

Or start in background:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

2. Access the services:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Local Development

#### Backend

1. Navigate to backend directory:
```bash
cd messaging-backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Copy environment file:
```bash
cp .env.example .env
```

5. Update `.env` with your configuration

6. Run migrations (when database is set up):
```bash
alembic upgrade head
```

7. Start the server:
```bash
uvicorn app.main:app --reload
```

#### Frontend

1. Navigate to frontend directory:
```bash
cd messaging-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your backend API URL

5. Start development server:
```bash
npm run dev
```

## Project Structure

```
messaging/
├── messaging-backend/     # FastAPI backend service
├── messaging-frontend/    # React frontend service
├── docker-compose.dev.yml # Development docker compose
└── README.md             # This file
```

## Features

- ✅ User authentication (signup, login, JWT)
- ✅ Client signup/registration
- ✅ Dashboard with real-time statistics
- ✅ Client contact management (CRUD)
- ✅ Message sending and history
- ✅ Template management (CRUD)
- ✅ Background job processing with Celery

## Documentation

- [Approach Document](APPROACH.md) - Detailed architecture and implementation approach
- [Engineering Rules](ENGINEERING_RULES.md) - Development guidelines

## License

MIT
