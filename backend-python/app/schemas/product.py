"""
ERP Lite - Schemas de Produto
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class ProductBase(BaseModel):
    """Schema base de produto"""
    code: str
    barcode: Optional[str] = None
    description: str
    short_description: str
    category_id: str
    brand_id: Optional[str] = None
    unit: str
    ncm: str
    cost_price: Decimal
    sale_price: Decimal
    min_stock: int = 0
    is_weighable: bool = False


class ProductCreate(ProductBase):
    """Schema para criar produto"""
    store_id: str


class ProductUpdate(BaseModel):
    """Schema para atualizar produto"""
    code: Optional[str] = None
    barcode: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    category_id: Optional[str] = None
    brand_id: Optional[str] = None
    unit: Optional[str] = None
    ncm: Optional[str] = None
    cost_price: Optional[Decimal] = None
    sale_price: Optional[Decimal] = None
    min_stock: Optional[int] = None
    is_weighable: Optional[bool] = None
    status: Optional[str] = None


class ProductResponse(ProductBase):
    """Schema para resposta de produto"""
    id: str
    store_id: str
    margin: Decimal
    status: str
    version: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    """Schema para lista de produtos"""
    success: bool
    data: List[ProductResponse]
    meta: dict
    
    class Config:
        from_attributes = True
