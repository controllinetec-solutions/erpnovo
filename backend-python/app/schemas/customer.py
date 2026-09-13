"""
ERP Lite - Schemas de Cliente
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class CustomerBase(BaseModel):
    """Schema base de cliente"""
    name: str
    document: Optional[str] = None
    document_type: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None


class CustomerCreate(CustomerBase):
    """Schema para criar cliente"""
    company_id: str


class CustomerUpdate(BaseModel):
    """Schema para atualizar cliente"""
    name: Optional[str] = None
    document: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    active: Optional[bool] = None


class CustomerResponse(CustomerBase):
    """Schema para resposta de cliente"""
    id: str
    company_id: str
    total_purchases: Decimal
    active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class CustomerListResponse(BaseModel):
    """Schema para lista de clientes"""
    success: bool
    data: List[CustomerResponse]
    
    class Config:
        from_attributes = True
