"""
Client contact model
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class ClientContact(Base):
    """Client contact model for message recipients"""
    __tablename__ = "client_contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)
    extra_data = Column(JSON, nullable=True)  # Renamed from 'metadata' as it's reserved in SQLAlchemy
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="client_contacts")
    messages = relationship("Message", back_populates="client_contact")
