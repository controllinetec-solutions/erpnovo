"""
ERP Lite - Model Supplier
"""

from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional

from app.models.base import Base, TimestampMixin, UUIDMixin


class Supplier(Base, UUIDMixin, TimestampMixin):
    """Model de Fornecedor"""
    
    __tablename__ = "suppliers"
    
    # Empresa
    company_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    
    # Dados básicos
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    trade_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    document: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    document_type: Mapped[str] = mapped_column(String(10), nullable=False)
    state_registration: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    
    # Contato
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    # Endereço
    address: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    state: Mapped[Optional[str]] = mapped_column(String(2), nullable=True)
    zip_code: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    
    # Status
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    
    def __repr__(self) -> str:
        return f"<Supplier {self.name}>"
