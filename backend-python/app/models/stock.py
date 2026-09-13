"""
ERP Lite - Models StockItem e StockMovement
"""

from sqlalchemy import String, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional
from datetime import datetime
from decimal import Decimal

from app.models.base import Base, UUIDMixin


class StockItem(Base, UUIDMixin):
    """Model de Item de Estoque"""
    
    __tablename__ = "stock_items"
    
    # Loja e produto
    store_id: Mapped[str] = mapped_column(String(36), ForeignKey("stores.id"), nullable=False)
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id"), nullable=False)
    
    # Quantidade
    quantity: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False, default=0)
    
    # Relacionamentos
    product: Mapped["Product"] = relationship("Product", back_populates="stock_items")
    movements: Mapped[list["StockMovement"]] = relationship("StockMovement", back_populates="stock_item")
    
    def __repr__(self) -> str:
        return f"<StockItem {self.product_id} qty={self.quantity}>"


class StockMovement(Base, UUIDMixin):
    """Model de Movimentação de Estoque"""
    
    __tablename__ = "stock_movements"
    
    # Item de estoque
    stock_item_id: Mapped[str] = mapped_column(String(36), ForeignKey("stock_items.id"), nullable=False)
    
    # Tipo de movimentação
    type: Mapped[str] = mapped_column(String(30), nullable=False)
    
    # Quantidades
    quantity: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)
    previous_qty: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)
    new_qty: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)
    
    # Custo unitário (para entradas)
    unit_cost: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)
    
    # Origem
    origin: Mapped[str] = mapped_column(String(255), nullable=False)
    reference_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    
    # Usuário
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    
    # Data
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    
    # Relacionamentos
    stock_item: Mapped["StockItem"] = relationship("StockItem", back_populates="movements")
    
    def __repr__(self) -> str:
        return f"<StockMovement {self.type} qty={self.quantity}>"
