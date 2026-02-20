"""
Client contact Pydantic schemas
"""
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, Dict, Any


class ClientContactBase(BaseModel):
    """Base client contact schema"""
    name: str
    phone: str
    email: Optional[EmailStr] = None
    extra_data: Optional[Dict[str, Any]] = None  # Renamed from 'metadata' to match model


class ClientContactCreate(ClientContactBase):
    """Client contact creation schema"""
    pass


class ClientContactResponse(ClientContactBase):
    """Client contact response schema"""
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
