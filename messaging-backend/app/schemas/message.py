"""
Message Pydantic schemas
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.message import MessageStatus


class MessageBase(BaseModel):
    """Base message schema"""
    content: str
    message_type: str = "sms"


class MessageCreate(MessageBase):
    """Message creation schema"""
    client_contact_id: int


class MessageResponse(MessageBase):
    """Message response schema"""
    id: int
    user_id: int
    client_contact_id: int
    provider_message_id: Optional[str] = None
    status: MessageStatus
    sent_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    failed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
