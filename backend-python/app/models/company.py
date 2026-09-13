"""
ERP Lite - Models Company e Store
"""

from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

from app.models.base import Base, TimestampMixin, UUIDMixin


class Company(Base, UUIDMixin, TimestampMixin):
    """Model de Empresa"""
    
    __tablename__ = "companies"
    
    # Dados básicos
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    trade_name: Mapped[str] = mapped_column(String(255), nullable=False)
    document: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    state_registration: Mapped[str | None] = mapped_column(String(20), nullable=True)
    
    # Endereço
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(2), nullable=False)
    zip_code: Mapped[str] = mapped_column(String(10), nullable=False)
    
    # Contato
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    
    # Segmento
    segment: Mapped[str] = mapped_column(String(50), nullable=False)
    
    # Status
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    
    # Relacionamentos
    stores: Mapped[List["Store"]] = relationship("Store", back_populates="company")
    users: Mapped[List["User"]] = relationship("User", back_populates="company")
    
    def __repr__(self) -> str:
        return f"<Company {self.name}>"


class Store(Base, UUIDMixin, TimestampMixin):
    """Model de Loja/Filial"""
    
    __tablename__ = "stores"
    
    # Dados básicos
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(10), nullable=False)
    
    # Empresa
    company_id: Mapped[str] = mapped_column(String(36), ForeignKey("companies.id"), nullable=False)
    
    # Endereço
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(2), nullable=False)
    zip_code: Mapped[str] = mapped_column(String(10), nullable=False)
    
    # Contato
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    
    # Status
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    
    # Relacionamentos
    company: Mapped["Company"] = relationship("Company", back_populates="stores")
    users: Mapped[List["User"]] = relationship("User", back_populates="store")
    products: Mapped[List["Product"]] = relationship("Product", back_populates="store")
    terminals: Mapped[List["Terminal"]] = relationship("Terminal", back_populates="store")
    
    def __repr__(self) -> str:
        return f"<Store {self.name}>"
