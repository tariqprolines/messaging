"""
Message model
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.database import Base


class MessageStatus(str, enum.Enum):
    """Message status enumeration"""
    PENDING = "pending"
    QUEUED = "queued"
    SENDING = "sending"
    SENT = "sent"
    DELIVERED = "delivered"
    FAILED = "failed"


class Message(Base):
    """Message model"""
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    client_contact_id = Column(Integer, ForeignKey("client_contacts.id"), nullable=False)
    provider_message_id = Column(String, nullable=True)
    status = Column(Enum(MessageStatus), default=MessageStatus.PENDING, nullable=False)
    content = Column(Text, nullable=False)
    message_type = Column(String, default="sms", nullable=False)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    failed_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="messages")
    client_contact = relationship("ClientContact", back_populates="messages")
