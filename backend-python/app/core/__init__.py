"""
ERP Lite - Configurações da Aplicação
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """
    Configurações da aplicação carregadas de variáveis de ambiente
    """
    
    # Aplicação
    APP_NAME: str = "ERP Lite"
    APP_ENV: str = "development"
    API_V1_STR: str = "/api/v1"
    
    # Banco de Dados
    DATABASE_URL: str = "postgresql://erp_user:erp_password@localhost:5432/erp_lite"
    
    # Segurança
    SECRET_KEY: str = "erp-lite-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    FRONTEND_URL: str = "http://localhost:5173"
    CORS_ORIGINS: str = "http://localhost:5173"
    
    # Logs
    LOG_LEVEL: str = "INFO"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Retorna lista de origens CORS"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Instância global de configurações
settings = Settings()
