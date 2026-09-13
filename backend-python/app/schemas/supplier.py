"""
ERP Lite - Schemas de Fornecedor
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class SupplierBase(BaseModel):
    """Schema base de fornecedor"""
    name: str
    trade_name: Optional[str] = None
    document: str
    document_type: str
    state_registration: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None


class SupplierCreate(SupplierBase):
    """Schema para criar fornecedor"""
    company_id: str


class SupplierUpdate(BaseModel):
    """Schema para atualizar fornecedor"""
    name: Optional[str] = None
    trade_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    active: Optional[bool] = None


class SupplierResponse(SupplierBase):
    """Schema para resposta de fornecedor"""
    id: str
    company_id: str
    active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class SupplierListResponse(BaseModel):
    """Schema para lista de fornecedores"""
    success: bool
    data: List[SupplierResponse]
    
    class Config:
        from_attributes = True
