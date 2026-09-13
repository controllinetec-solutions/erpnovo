#!/bin/bash

# ============================================
# ERP Lite Python - Script de Setup Completo
# ============================================

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}║   🚀 ERP Lite Python - Setup Completo                   ║${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se está na pasta correta
if [ ! -f "requirements.txt" ]; then
    echo -e "${RED}❌ Execute este script na pasta backend-python${NC}"
    exit 1
fi

# ============================================
# PASSO 1: Verificar Python
# ============================================
echo -e "${BLUE}[1/7] Verificando Python...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3 não encontrado${NC}"
    echo -e "${YELLOW}   Instale Python 3.11+ em: https://python.org${NC}"
    exit 1
fi

PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo -e "${GREEN}✅ Python $PYTHON_VERSION encontrado${NC}"

# ============================================
# PASSO 2: Criar ambiente virtual
# ============================================
echo -e "${BLUE}[2/7] Criando ambiente virtual...${NC}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✅ Ambiente virtual criado${NC}"
else
    echo -e "${YELLOW}⚠️  Ambiente virtual já existe${NC}"
fi

# Ativar ambiente virtual
source venv/bin/activate

# ============================================
# PASSO 3: Instalar dependências
# ============================================
echo -e "${BLUE}[3/7] Instalando dependências...${NC}"
pip install --upgrade pip -q
pip install -r requirements.txt -q
echo -e "${GREEN}✅ Dependências instaladas${NC}"

# ============================================
# PASSO 4: Configurar .env
# ============================================
echo -e "${BLUE}[4/7] Configurando variáveis de ambiente...${NC}"
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Arquivo .env criado${NC}"
    echo -e "${YELLOW}   ⚠️  IMPORTANTE: Edite .env com suas configurações${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo .env já existe${NC}"
fi

# ============================================
# PASSO 5: Verificar PostgreSQL
# ============================================
echo -e "${BLUE}[5/7] Verificando PostgreSQL...${NC}"
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL client encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL client não encontrado${NC}"
    echo -e "${YELLOW}   Você pode usar Docker: docker-compose -f docker-compose-python.yml up -d postgres${NC}"
fi

# ============================================
# PASSO 6: Executar migrations
# ============================================
echo -e "${BLUE}[6/7] Executando migrations...${NC}"
if alembic upgrade head 2>/dev/null; then
    echo -e "${GREEN}✅ Migrations executadas${NC}"
else
    echo -e "${YELLOW}⚠️  Não foi possível executar migrations${NC}"
    echo -e "${YELLOW}   Verifique se o PostgreSQL está rodando${NC}"
    echo -e "${YELLOW}   Ou use: python -c \"from app.core.database import engine, Base; import asyncio; asyncio.run(engine.begin().__aenter__().then(lambda c: c.run_sync(Base.metadata.create_all)))\"${NC}"
fi

# ============================================
# PASSO 7: Popular dados iniciais
# ============================================
echo -e "${BLUE}[7/7] Populando dados iniciais...${NC}"
if python scripts/seed.py 2>/dev/null; then
    echo -e "${GREEN}✅ Dados iniciais populados${NC}"
else
    echo -e "${YELLOW}⚠️  Não foi possível popular dados${NC}"
    echo -e "${YELLOW}   Execute manualmente: python scripts/seed.py${NC}"
fi

# ============================================
# RESULTADO
# ============================================
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║   ✅ Setup concluído com sucesso!                       ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📖 Próximos passos:${NC}"
echo ""
echo -e "  1. Ativar ambiente virtual:"
echo -e "     ${YELLOW}source venv/bin/activate${NC}"
echo ""
echo -e "  2. Iniciar servidor:"
echo -e "     ${YELLOW}uvicorn app.main:app --reload --port 8000${NC}"
echo ""
echo -e "  3. Acessar documentação:"
echo -e "     ${YELLOW}http://localhost:8000/docs${NC}"
echo ""
echo -e "  4. Testar API:"
echo -e "     ${YELLOW}curl http://localhost:8000/health${NC}"
echo ""
echo -e "${BLUE}🔐 Credenciais padrão:${NC}"
echo -e "     ${YELLOW}admin@erplite.com.br / admin123${NC}"
echo ""
