"""
Message template Pydantic schemas
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any


class MessageTemplateBase(BaseModel):
    """Base template schema"""
    name: str
    content: str
    variables: Optional[Dict[str, Any]] = None


class MessageTemplateCreate(MessageTemplateBase):
    """Template creation schema"""
    pass


class MessageTemplateResponse(MessageTemplateBase):
    """Template response schema"""
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
