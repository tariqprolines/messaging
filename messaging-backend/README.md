# Messaging Backend Service

FastAPI backend service for the messaging portal.

## Features

- User authentication (signup, login, JWT tokens)
- Client contact management
- Message sending
- Background job processing with Celery
- Webhook handling for message provider callbacks

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration (especially `DATABASE_URL` and `SECRET_KEY`)

4. **Database Setup:**
   
   **Option A: Automatic (Development only)**
   - Tables will be created automatically on startup if `ENVIRONMENT=development`
   - Just start the server and tables will be created
   
   **Option B: Using Alembic migrations (Recommended for production)**
   ```bash
   # Create initial migration (already done)
   # alembic revision --autogenerate -m "Initial migration"
   
   # Apply migrations
   alembic upgrade head
   ```

5. Start the server:
```bash
uvicorn app.main:app --reload
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

Run tests:
```bash
pytest
```

Format code:
```bash
black .
```
