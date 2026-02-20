"""
Message sending endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.message import Message, MessageStatus
from app.models.client import ClientContact
from app.schemas.message import MessageCreate, MessageResponse
from app.tasks.send_message import send_message_task

router = APIRouter()


@router.post("/send", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send a message to a client
    """
    # Verify client belongs to user
    client = db.query(ClientContact).filter(
        ClientContact.id == message_data.client_contact_id,
        ClientContact.user_id == current_user.id
    ).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Create message record
    new_message = Message(
        user_id=current_user.id,
        client_contact_id=message_data.client_contact_id,
        content=message_data.content,
        message_type=message_data.message_type,
        status=MessageStatus.PENDING
    )
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    # Queue message for sending via Celery
    try:
        send_message_task.delay(
            to=client.phone,
            content=message_data.content,
            message_id=new_message.id
        )
        new_message.status = MessageStatus.QUEUED
        db.commit()
    except Exception as e:
        new_message.status = MessageStatus.FAILED
        new_message.error_message = str(e)
        db.commit()
    
    return new_message


@router.get("/", response_model=List[MessageResponse])
async def get_messages(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get message history for the current user
    """
    query = db.query(Message).filter(Message.user_id == current_user.id)
    
    if status:
        try:
            status_enum = MessageStatus(status)
            query = query.filter(Message.status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status: {status}"
            )
    
    messages = query.order_by(Message.created_at.desc()).all()
    return messages


@router.get("/{message_id}", response_model=MessageResponse)
async def get_message(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single message by ID
    """
    message = db.query(Message).filter(
        Message.id == message_id,
        Message.user_id == current_user.id
    ).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    return message


@router.post("/{message_id}/retry", response_model=MessageResponse)
async def retry_message(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retry a failed message
    """
    message = db.query(Message).filter(
        Message.id == message_id,
        Message.user_id == current_user.id
    ).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    if message.status != MessageStatus.FAILED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only failed messages can be retried"
        )
    
    client = db.query(ClientContact).filter(ClientContact.id == message.client_contact_id).first()
    
    # Reset message status and retry
    message.status = MessageStatus.PENDING
    message.error_message = None
    db.commit()
    
    try:
        send_message_task.delay(
            to=client.phone,
            content=message.content,
            message_id=message.id
        )
        message.status = MessageStatus.QUEUED
        db.commit()
    except Exception as e:
        message.status = MessageStatus.FAILED
        message.error_message = str(e)
        db.commit()
    
    return message
