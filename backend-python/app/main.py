"""
ERP Lite - Aplicação Principal FastAPI
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import api_router

# Configurar logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gerenciador de ciclo de vida da aplicação
    """
    # Startup
    logger.info("🚀 Iniciando ERP Lite Backend...")
    logger.info(f"📍 Ambiente: {settings.APP_ENV}")
    logger.info(f"🔗 API: {settings.API_V1_STR}")
    
    # Criar tabelas (apenas em desenvolvimento)
    if settings.APP_ENV == "development":
        logger.info("🗄️  Criando tabelas do banco de dados...")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("✅ Tabelas criadas com sucesso")
    
    yield
    
    # Shutdown
    logger.info("🛑 Encerrando ERP Lite Backend...")


# Criar aplicação FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    description="API REST do ERP Lite para varejo alimentar",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas da API
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "ok",
        "timestamp": "2026-01-15T14:30:00.000Z",
        "version": "1.0.0",
        "environment": settings.APP_ENV
    }


@app.get("/")
async def root():
    """
    Root endpoint
    """
    return {
        "message": "ERP Lite API",
        "version": "1.0.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
