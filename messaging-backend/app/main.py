"""
FastAPI Application Entry Point
"""
# Import models first to ensure they're registered with SQLAlchemy
from app.models import User, ClientContact, Message, MessageTemplate  # noqa: F401

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth, clients, messages, templates, webhooks
from app.database import engine, Base

app = FastAPI(
    title="Messaging Portal API",
    description="Backend API for messaging portal",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


@app.on_event("startup")
async def startup_event():
    """Create database tables on startup (for development)"""
    # In production, use Alembic migrations instead
    # Run: alembic upgrade head
    if settings.ENVIRONMENT == "development":
        try:
            # Create all tables
            Base.metadata.create_all(bind=engine)
            print("Database tables created/verified successfully")
        except Exception as e:
            print(f"Warning: Could not create tables automatically: {e}")
            print("Please run: alembic upgrade head")

# CORS Configuration
cors_origins = settings.cors_origins_list
print(f"CORS configured with origins: {cors_origins}")
if not cors_origins:
    print("WARNING: CORS_ORIGINS is empty! CORS will block all requests.")
    print(f"CORS_ORIGINS value from env: '{settings.CORS_ORIGINS}'")
    # In development, allow localhost origins as fallback
    if settings.ENVIRONMENT == "development":
        cors_origins = [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
        ]
        print(f"Using development fallback origins: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(clients.router, prefix="/api/v1/clients", tags=["clients"])
app.include_router(messages.router, prefix="/api/v1/messages", tags=["messages"])
app.include_router(templates.router, prefix="/api/v1/templates", tags=["templates"])
app.include_router(webhooks.router, prefix="/api/v1/webhooks", tags=["webhooks"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Messaging Portal API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "messaging-backend",
        "version": "1.0.0"
    }
