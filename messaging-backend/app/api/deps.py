"""
Dependency injection utilities
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.security import decode_token
from app.core.exceptions import InvalidTokenError

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token
    """
    token = credentials.credentials
    payload = decode_token(token)
    
    if not payload:
        raise InvalidTokenError()
    
    user_email = payload.get("sub")
    if not user_email:
        raise InvalidTokenError()
    
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise InvalidTokenError()
    
    return user
