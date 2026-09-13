"""
ERP Lite - Schemas de Autenticação
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class LoginRequest(BaseModel):
    """Schema para requisição de login"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schema para resposta de token"""
    access_token: str
    refresh_token: str
    expires_in: int


class UserResponse(BaseModel):
    """Schema para resposta de usuário"""
    id: str
    name: str
    email: str
    role: str
    store_id: str
    store_name: str
    company_id: str
    company_name: str
    permissions: List[str]
    active: bool
    last_login: Optional[datetime]
    
    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    """Schema para resposta de login"""
    success: bool
    data: dict
    
    class Config:
        from_attributes = True


class RefreshTokenRequest(BaseModel):
    """Schema para requisição de refresh token"""
    refresh_token: str
