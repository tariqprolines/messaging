"""
Message template endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.template import MessageTemplate
from app.schemas.template import MessageTemplateCreate, MessageTemplateResponse

router = APIRouter()


@router.get("/", response_model=List[MessageTemplateResponse])
async def get_templates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all message templates for the current user
    """
    templates = db.query(MessageTemplate).filter(MessageTemplate.user_id == current_user.id).all()
    return templates


@router.get("/{template_id}", response_model=MessageTemplateResponse)
async def get_template(
    template_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single template by ID
    """
    template = db.query(MessageTemplate).filter(
        MessageTemplate.id == template_id,
        MessageTemplate.user_id == current_user.id
    ).first()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )
    
    return template


@router.post("/", response_model=MessageTemplateResponse, status_code=status.HTTP_201_CREATED)
async def create_template(
    template_data: MessageTemplateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new message template
    """
    new_template = MessageTemplate(
        user_id=current_user.id,
        name=template_data.name,
        content=template_data.content,
        variables=template_data.variables
    )
    
    db.add(new_template)
    db.commit()
    db.refresh(new_template)
    
    return new_template


@router.put("/{template_id}", response_model=MessageTemplateResponse)
async def update_template(
    template_id: int,
    template_data: MessageTemplateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a message template
    """
    template = db.query(MessageTemplate).filter(
        MessageTemplate.id == template_id,
        MessageTemplate.user_id == current_user.id
    ).first()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )
    
    template.name = template_data.name
    template.content = template_data.content
    template.variables = template_data.variables
    
    db.commit()
    db.refresh(template)
    
    return template


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(
    template_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a message template
    """
    template = db.query(MessageTemplate).filter(
        MessageTemplate.id == template_id,
        MessageTemplate.user_id == current_user.id
    ).first()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )
    
    db.delete(template)
    db.commit()
    
    return None
