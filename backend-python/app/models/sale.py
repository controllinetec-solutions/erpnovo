"""
ERP Lite - Models Sale, SaleItem e SalePayment
"""

from sqlalchemy import String, Numeric, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

from app.models.base import Base, TimestampMixin, UUIDMixin


class Sale(Base, UUIDMixin, TimestampMixin):
    """Model de Venda"""
    
    __tablename__ = "sales"
    
    # Identificação única do PDV (idempotência)
    sale_id: Mapped[str] = mapped_column(String(36), unique=True, nullable=False, index=True)
    
    # Loja e terminal
    store_id: Mapped[str] = mapped_column(String(36), ForeignKey("stores.id"), nullable=False)
    terminal_id: Mapped[str] = mapped_column(String(36), ForeignKey("terminals.id"), nullable=False)
    operator_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    
    # Cliente
    customer_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("customers.id"), nullable=True)
    
    # Data
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    
    # Valores
    subtotal: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    discount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    total: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    
    # Status
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="COMPLETED")
    
    # Fiscal
    fiscal_doc_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    
    # Sincronização
    synced: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    sync_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Relacionamentos
    items: Mapped[List["SaleItem"]] = relationship("SaleItem", back_populates="sale", cascade="all, delete-orphan")
    payments: Mapped[List["SalePayment"]] = relationship("SalePayment", back_populates="sale", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Sale {self.sale_id}>"


class SaleItem(Base, UUIDMixin):
    """Model de Item de Venda"""
    
    __tablename__ = "sale_items"
    
    # Venda
    sale_id: Mapped[str] = mapped_column(String(36), ForeignKey("sales.id"), nullable=False)
    
    # Produto
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id"), nullable=False)
    
    # Dados do item
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    barcode: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    quantity: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    discount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    total: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    
    # Pesável
    is_weighable: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    weight: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 3), nullable=True)
    
    # Relacionamentos
    sale: Mapped["Sale"] = relationship("Sale", back_populates="items")
    product: Mapped["Product"] = relationship("Product")
    
    def __repr__(self) -> str:
        return f"<SaleItem {self.description}>"


class SalePayment(Base, UUIDMixin):
    """Model de Pagamento de Venda"""
    
    __tablename__ = "sale_payments"
    
    # Venda
    sale_id: Mapped[str] = mapped_column(String(36), ForeignKey("sales.id"), nullable=False)
    
    # Pagamento
    type: Mapped[str] = mapped_column(String(20), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    # Relacionamentos
    sale: Mapped["Sale"] = relationship("Sale", back_populates="payments")
    
    def __repr__(self) -> str:
        return f"<SalePayment {self.type} {self.amount}>"
