"""
ERP Lite - Conexão com Banco de Dados
"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Converter URL do PostgreSQL para versão assíncrona
DATABASE_URL = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

# Criar engine assíncrono
engine = create_async_engine(
    DATABASE_URL,
    echo=settings.APP_ENV == "development",
    future=True,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

# Criar sessão assíncrona
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)


class Base(DeclarativeBase):
    """Classe base para todos os models SQLAlchemy"""
    pass


async def get_db() -> AsyncSession:
    """
    Dependency para obter sessão do banco de dados
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Erro no banco de dados: {str(e)}")
            raise
        finally:
            await session.close()


async def init_db():
    """
    Inicializar banco de dados (criar tabelas)
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("✅ Banco de dados inicializado")
