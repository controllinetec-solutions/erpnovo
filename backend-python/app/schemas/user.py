"""
ERP Lite - Schemas de Usuário
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    """Schema base de usuário"""
    name: str
    email: EmailStr


class UserCreate(UserBase):
    """Schema para criar usuário"""
    password: str
    role: str = "OPERATOR"
    company_id: str
    store_id: str
    permissions: List[str] = []


class UserUpdate(BaseModel):
    """Schema para atualizar usuário"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    permissions: Optional[List[str]] = None
    active: Optional[bool] = None


class UserResponse(UserBase):
    """Schema para resposta de usuário"""
    id: str
    role: str
    company_id: str
    store_id: str
    permissions: List[str]
    active: bool
    last_login: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class UserInDB(UserResponse):
    """Schema de usuário no banco de dados"""
    password_hash: str
