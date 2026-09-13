#!/bin/bash

# ============================================
# ERP Lite Python - Script de Inicialização
# ============================================

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}║   🚀 ERP Lite Python - Backend FastAPI                  ║${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se está na pasta correta
if [ ! -f "requirements.txt" ]; then
    echo -e "${YELLOW}⚠️  Execute este script na pasta backend-python${NC}"
    exit 1
fi

# Verificar se o ambiente virtual existe
if [ ! -d "venv" ]; then
    echo -e "${BLUE}📦 Criando ambiente virtual...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✅ Ambiente virtual criado${NC}"
fi

# Ativar ambiente virtual
echo -e "${BLUE}🔧 Ativando ambiente virtual...${NC}"
source venv/bin/activate

# Instalar dependências
echo -e "${BLUE}📦 Instalando dependências...${NC}"
pip install -r requirements.txt -q
echo -e "${GREEN}✅ Dependências instaladas${NC}"

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo -e "${BLUE}📝 Criando arquivo .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Arquivo .env criado${NC}"
fi

# Verificar se o banco de dados está configurado
echo -e "${BLUE}🗄️  Verificando banco de dados...${NC}"

# Tentar criar tabelas
python -c "
import asyncio
from app.core.database import engine, Base

async def init():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print('✅ Tabelas verificadas')

asyncio.run(init())
" 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Não foi possível conectar ao PostgreSQL${NC}"
    echo -e "${YELLOW}   Verifique se o PostgreSQL está rodando${NC}"
    echo -e "${YELLOW}   Ou use Docker: docker-compose up -d postgres${NC}"
}

# Verificar se já tem dados
echo -e "${BLUE}🌱 Verificando dados iniciais...${NC}"
python -c "
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.user import User

async def check():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User))
        users = result.scalars().all()
        if len(users) == 0:
            print('⚠️  Nenhum usuário encontrado')
            print('💡 Execute: python scripts/seed.py')
        else:
            print(f'✅ {len(users)} usuários encontrados')

asyncio.run(check())
" 2>/dev/null || echo -e "${YELLOW}⚠️  Não foi possível verificar usuários${NC}"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║   ✅ Ambiente pronto!                                   ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📖 Próximos passos:${NC}"
echo ""
echo -e "  1. Popular banco com dados iniciais:"
echo -e "     ${YELLOW}python scripts/seed.py${NC}"
echo ""
echo -e "  2. Iniciar o servidor:"
echo -e "     ${YELLOW}uvicorn app.main:app --reload --port 8000${NC}"
echo ""
echo -e "  3. Acessar documentação:"
echo -e "     ${YELLOW}http://localhost:8000/docs${NC}"
echo ""
echo -e "${BLUE}🔐 Credenciais padrão:${NC}"
echo -e "     ${YELLOW}admin@erplite.com.br / admin123${NC}"
echo ""
