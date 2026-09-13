"""
ERP Lite - Models Product, Category e Brand
"""

from sqlalchemy import String, Boolean, Numeric, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

from app.models.base import Base, TimestampMixin, UUIDMixin, SoftDeleteMixin


class Category(Base, UUIDMixin, TimestampMixin):
    """Model de Categoria"""
    
    __tablename__ = "categories"
    
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    parent_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("categories.id"), nullable=True)
    
    # Relacionamentos
    parent: Mapped[Optional["Category"]] = relationship("Category", remote_side="Category.id")
    products: Mapped[List["Product"]] = relationship("Product", back_populates="category")
    
    def __repr__(self) -> str:
        return f"<Category {self.name}>"


class Brand(Base, UUIDMixin, TimestampMixin):
    """Model de Marca"""
    
    __tablename__ = "brands"
    
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    
    # Relacionamentos
    products: Mapped[List["Product"]] = relationship("Product", back_populates="brand")
    
    def __repr__(self) -> str:
        return f"<Brand {self.name}>"


class Product(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """Model de Produto"""
    
    __tablename__ = "products"
    
    # Loja
    store_id: Mapped[str] = mapped_column(String(36), ForeignKey("stores.id"), nullable=False)
    
    # Identificação
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    barcode: Mapped[Optional[str]] = mapped_column(String(50), unique=True, nullable=True, index=True)
    
    # Descrição
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    short_description: Mapped[str] = mapped_column(String(100), nullable=False)
    
    # Relacionamentos
    category_id: Mapped[str] = mapped_column(String(36), ForeignKey("categories.id"), nullable=False)
    brand_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("brands.id"), nullable=True)
    
    # Unidade e fiscal
    unit: Mapped[str] = mapped_column(String(10), nullable=False)
    ncm: Mapped[str] = mapped_column(String(20), nullable=False)
    cest: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    icms_cst: Mapped[str] = mapped_column(String(10), nullable=False, default="00")
    
    # Preços
    cost_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    sale_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    margin: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    
    # Estoque
    min_stock: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    max_stock: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Pesável
    is_weighable: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    scale_code: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Status
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE")
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    
    # Relacionamentos
    store: Mapped["Store"] = relationship("Store", back_populates="products")
    category: Mapped["Category"] = relationship("Category", back_populates="products")
    brand: Mapped[Optional["Brand"]] = relationship("Brand", back_populates="products")
    stock_items: Mapped[List["StockItem"]] = relationship("StockItem", back_populates="product")
    
    def __repr__(self) -> str:
        return f"<Product {self.description}>"
