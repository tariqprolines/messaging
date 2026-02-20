"""
Custom exceptions
"""
from fastapi import HTTPException, status


class MessagingException(HTTPException):
    """Base exception for messaging portal"""
    pass


class UserNotFoundError(MessagingException):
    """User not found exception"""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )


class UserAlreadyExistsError(MessagingException):
    """User already exists exception"""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )


class InvalidCredentialsError(MessagingException):
    """Invalid credentials exception"""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )


class InvalidTokenError(MessagingException):
    """Invalid token exception"""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )


class MessageProviderError(MessagingException):
    """Message provider error exception"""
    def __init__(self, detail: str = "Message provider error"):
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=detail
        )
