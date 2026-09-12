#!/bin/bash

# ============================================
# ERP Lite - Verificação de Pré-requisitos
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
echo -e "${BLUE}║   🔍 ERP Lite - Verificação de Pré-requisitos           ║${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

ERRORS=0

# ============================================
# 1. VERIFICAR NODE.JS
# ============================================
echo -e "${BLUE}[1/6] Verificando Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | tr -d 'v')
    
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo -e "${GREEN}  ✅ Node.js $NODE_VERSION instalado${NC}"
    else
        echo -e "${RED}  ❌ Node.js $NODE_VERSION (requer 18+)${NC}"
        ERRORS=$((ERRORS+1))
    fi
else
    echo -e "${RED}  ❌ Node.js não encontrado${NC}"
    echo -e "${YELLOW}     📥 Instale em: https://nodejs.org/${NC}"
    ERRORS=$((ERRORS+1))
fi

# ============================================
# 2. VERIFICAR NPM
# ============================================
echo -e "${BLUE}[2/6] Verificando npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}  ✅ npm $NPM_VERSION instalado${NC}"
else
    echo -e "${RED}  ❌ npm não encontrado${NC}"
    ERRORS=$((ERRORS+1))
fi

# ============================================
# 3. VERIFICAR GIT (opcional)
# ============================================
echo -e "${BLUE}[3/6] Verificando Git...${NC}"
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}  ✅ $GIT_VERSION${NC}"
else
    echo -e "${YELLOW}  ⚠️  Git não encontrado (opcional)${NC}"
fi

# ============================================
# 4. VERIFICAR DOCKER (opcional)
# ============================================
echo -e "${BLUE}[4/6] Verificando Docker...${NC}"
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}  ✅ $DOCKER_VERSION${NC}"
    
    # Verificar se Docker está rodando
    if docker info &> /dev/null; then
        echo -e "${GREEN}  ✅ Docker daemon está rodando${NC}"
    else
        echo -e "${YELLOW}  ⚠️  Docker instalado mas não está rodando${NC}"
        echo -e "${YELLOW}     💡 Inicie o Docker Desktop${NC}"
    fi
else
    echo -e "${YELLOW}  ⚠️  Docker não encontrado (opcional - necessário para opção 3)${NC}"
fi

# ============================================
# 5. VERIFICAR PORTAS
# ============================================
echo -e "${BLUE}[5/6] Verificando portas disponíveis...${NC}"

check_port() {
    local port=$1
    local name=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${RED}  ❌ Porta $port ($name) já está em uso${NC}"
        ERRORS=$((ERRORS+1))
    else
        echo -e "${GREEN}  ✅ Porta $port ($name) disponível${NC}"
    fi
}

check_port 5173 "Frontend"
check_port 3001 "Backend"
check_port 5432 "PostgreSQL"

# ============================================
# 6. VERIFICAR ESTRUTURA DO PROJETO
# ============================================
echo -e "${BLUE}[6/6] Verificando estrutura do projeto...${NC}"

if [ -f "package.json" ]; then
    echo -e "${GREEN}  ✅ package.json encontrado${NC}"
else
    echo -e "${RED}  ❌ package.json não encontrado${NC}"
    echo -e "${YELLOW}     💡 Execute este script na raiz do projeto${NC}"
    ERRORS=$((ERRORS+1))
fi

if [ -d "backend" ]; then
    echo -e "${GREEN}  ✅ Pasta backend encontrada${NC}"
else
    echo -e "${RED}  ❌ Pasta backend não encontrada${NC}"
    ERRORS=$((ERRORS+1))
fi

if [ -f "backend/package.json" ]; then
    echo -e "${GREEN}  ✅ backend/package.json encontrado${NC}"
else
    echo -e "${RED}  ❌ backend/package.json não encontrado${NC}"
    ERRORS=$((ERRORS+1))
fi

# ============================================
# RESULTADO FINAL
# ============================================
echo ""
echo -e "${BLUE}══════════════════════════════════════════════════════════${NC}"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}                                                          ${NC}"
    echo -e "${GREEN}  ✅ TODOS OS PRÉ-REQUISITOS ESTÃO OK!                   ${NC}"
    echo -e "${GREEN}                                                          ${NC}"
    echo -e "${GREEN}  Você pode prosseguir com a instalação.                 ${NC}"
    echo -e "${GREEN}                                                          ${NC}"
    echo -e "${BLUE}══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${GREEN}  📖 Próximo passo: ${NC}"
    echo -e "${YELLOW}     ./scripts/instalar.sh${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}                                                          ${NC}"
    echo -e "${RED}  ❌ ENCONTRADOS $ERROS PROBLEMA(S)                       ${NC}"
    echo -e "${RED}                                                          ${NC}"
    echo -e "${RED}  Corrija os problemas acima antes de continuar.         ${NC}"
    echo -e "${RED}                                                          ${NC}"
    echo -e "${BLUE}══════════════════════════════════════════════════════════${NC}"
    echo ""
    exit 1
fi
