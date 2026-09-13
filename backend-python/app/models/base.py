"""
ERP Lite - Model Base
"""

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, DateTime, Boolean
from sqlalchemy.sql import func
from datetime import datetime
import uuid


class Base(DeclarativeBase):
    """Classe base para todos os models"""
    pass


class TimestampMixin:
    """Mixin para adicionar timestamps"""
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )


class UUIDMixin:
    """Mixin para adicionar UUID"""
    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )


class SoftDeleteMixin:
    """Mixin para soft delete"""
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    @property
    def is_deleted(self) -> bool:
        return self.deleted_at is not None
