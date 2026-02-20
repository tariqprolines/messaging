"""
Client contact management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.client import ClientContact
from app.schemas.client import ClientContactCreate, ClientContactResponse

router = APIRouter()


@router.get("/", response_model=List[ClientContactResponse])
async def get_clients(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all client contacts for the current user
    """
    clients = db.query(ClientContact).filter(ClientContact.user_id == current_user.id).all()
    return clients


@router.get("/{client_id}", response_model=ClientContactResponse)
async def get_client(
    client_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single client contact by ID
    """
    client = db.query(ClientContact).filter(
        ClientContact.id == client_id,
        ClientContact.user_id == current_user.id
    ).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    return client


@router.post("/", response_model=ClientContactResponse, status_code=status.HTTP_201_CREATED)
async def create_client(
    client_data: ClientContactCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new client contact
    """
    new_client = ClientContact(
        user_id=current_user.id,
        name=client_data.name,
        phone=client_data.phone,
        email=client_data.email,
        extra_data=client_data.extra_data
    )
    
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    
    return new_client


@router.put("/{client_id}", response_model=ClientContactResponse)
async def update_client(
    client_id: int,
    client_data: ClientContactCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a client contact
    """
    client = db.query(ClientContact).filter(
        ClientContact.id == client_id,
        ClientContact.user_id == current_user.id
    ).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    client.name = client_data.name
    client.phone = client_data.phone
    client.email = client_data.email
    client.extra_data = client_data.extra_data
    
    db.commit()
    db.refresh(client)
    
    return client


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(
    client_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a client contact
    """
    client = db.query(ClientContact).filter(
        ClientContact.id == client_id,
        ClientContact.user_id == current_user.id
    ).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    db.delete(client)
    db.commit()
    
    return None
