"""
ERP Lite - Model User
"""

from sqlalchemy import String, Boolean, ForeignKey, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional
from datetime import datetime

from app.models.base import Base, TimestampMixin, UUIDMixin


class User(Base, UUIDMixin, TimestampMixin):
    """Model de Usuário"""
    
    __tablename__ = "users"
    
    # Dados básicos
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    
    # Relacionamento com empresa e loja
    company_id: Mapped[str] = mapped_column(String(36), ForeignKey("companies.id"), nullable=False)
    store_id: Mapped[str] = mapped_column(String(36), ForeignKey("stores.id"), nullable=False)
    
    # Role e permissões
    role: Mapped[str] = mapped_column(String(50), nullable=False, default="OPERATOR")
    permissions: Mapped[List[str]] = mapped_column(ARRAY(String), nullable=False, default=[])
    
    # Status
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    last_login: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    
    # Relacionamentos
    company: Mapped["Company"] = relationship("Company", back_populates="users")
    store: Mapped["Store"] = relationship("Store", back_populates="users")
    
    def __repr__(self) -> str:
        return f"<User {self.email}>"
