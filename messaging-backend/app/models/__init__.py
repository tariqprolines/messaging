# Models module
# Import all models to ensure they're registered with SQLAlchemy
from app.models.user import User
from app.models.client import ClientContact
from app.models.message import Message, MessageStatus
from app.models.template import MessageTemplate

__all__ = ["User", "ClientContact", "Message", "MessageStatus", "MessageTemplate"]