"""
ERP Lite - Model Terminal
"""

from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional
from datetime import datetime

from app.models.base import Base, TimestampMixin, UUIDMixin


class Terminal(Base, UUIDMixin, TimestampMixin):
    """Model de Terminal PDV"""
    
    __tablename__ = "terminals"
    
    # Loja
    store_id: Mapped[str] = mapped_column(String(36), ForeignKey("stores.id"), nullable=False)
    
    # Dados do terminal
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    token: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    
    # Status
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="OFFLINE")
    
    # Versão e sincronização
    pdv_version: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    last_sync: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    last_access: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    sync_cursor: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    # Relacionamentos
    store: Mapped["Store"] = relationship("Store", back_populates="terminals")
    
    def __repr__(self) -> str:
        return f"<Terminal {self.name}>"
