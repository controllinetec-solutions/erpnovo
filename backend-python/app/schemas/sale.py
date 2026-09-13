"""
ERP Lite - Schemas de Venda
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class SaleItemBase(BaseModel):
    """Schema base de item de venda"""
    product_id: str
    barcode: Optional[str] = None
    description: str
    quantity: Decimal
    unit_price: Decimal
    discount: Decimal = Decimal(0)
    total: Decimal
    is_weighable: bool = False
    weight: Optional[Decimal] = None


class PaymentBase(BaseModel):
    """Schema base de pagamento"""
    type: str
    amount: Decimal
    reference: Optional[str] = None


class SaleBase(BaseModel):
    """Schema base de venda"""
    sale_id: str
    terminal_id: str
    operator_id: str
    customer_id: Optional[str] = None
    date: datetime
    items: List[SaleItemBase]
    payments: List[PaymentBase]
    subtotal: Decimal
    discount: Decimal = Decimal(0)
    total: Decimal
    idempotency_key: str


class SaleCreate(SaleBase):
    """Schema para criar venda"""
    pass


class SaleResponse(BaseModel):
    """Schema para resposta de venda"""
    id: str
    sale_id: str
    store_id: str
    terminal_id: str
    operator_id: str
    customer_id: Optional[str]
    date: datetime
    subtotal: Decimal
    discount: Decimal
    total: Decimal
    status: str
    synced: bool
    sync_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class SaleListResponse(BaseModel):
    """Schema para lista de vendas"""
    success: bool
    data: List[SaleResponse]
    meta: dict
    
    class Config:
        from_attributes = True
