"""
ERP Lite - Model Customer
"""

from sqlalchemy import String, Boolean, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from decimal import Decimal

from app.models.base import Base, TimestampMixin, UUIDMixin


class Customer(Base, UUIDMixin, TimestampMixin):
    """Model de Cliente"""
    
    __tablename__ = "customers"
    
    # Empresa
    company_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    
    # Dados básicos
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    document: Mapped[Optional[str]] = mapped_column(String(20), nullable=True, index=True)
    document_type: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    
    # Contato
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    # Endereço
    address: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    state: Mapped[Optional[str]] = mapped_column(String(2), nullable=True)
    zip_code: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    
    # Total de compras
    total_purchases: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    
    # Status
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    
    def __repr__(self) -> str:
        return f"<Customer {self.name}>"
