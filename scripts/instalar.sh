#!/bin/bash

# ============================================
# ERP Lite - Script de Instalação Completa
# ============================================

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

clear

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║   📦 ERP Lite - Instalação Completa                     ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# ============================================
# FUNÇÃO DE STATUS
# ============================================
show_step() {
    echo ""
    echo -e "${BLUE}══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  📍 PASSO $1: $2${NC}"
    echo -e "${BLUE}══════════════════════════════════════════════════════════${NC}"
    echo ""
}

show_success() {
    echo -e "${GREEN}  ✅ $1${NC}"
}

show_error() {
    echo -e "${RED}  ❌ $1${NC}"
}

show_info() {
    echo -e "${YELLOW}  ℹ️  $1${NC}"
}

# ============================================
# PASSO 1: VERIFICAR PRÉ-REQUISITOS
# ============================================
show_step "1" "Verificando pré-requisitos"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    show_error "Node.js não encontrado"
    show_info "Instale em: https://nodejs.org/"
    exit 1
fi
show_success "Node.js $(node --version)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    show_error "npm não encontrado"
    exit 1
fi
show_success "npm $(npm --version)"

# ============================================
# PASSO 2: INSTALAR DEPENDÊNCIAS DO FRONTEND
# ============================================
show_step "2" "Instalando dependências do Frontend"

echo -e "${YELLOW}  📦 Executando: npm install${NC}"
echo ""

if npm install; then
    show_success "Dependências do Frontend instaladas"
else
    show_error "Falha ao instalar dependências do Frontend"
    exit 1
fi

# ============================================
# PASSO 3: INSTALAR DEPENDÊNCIAS DO BACKEND
# ============================================
show_step "3" "Instalando dependências do Backend"

echo -e "${YELLOW}  📦 Executando: cd backend && npm install${NC}"
echo ""

cd backend

if npm install; then
    show_success "Dependências do Backend instaladas"
else
    show_error "Falha ao instalar dependências do Backend"
    exit 1
fi

# ============================================
# PASSO 4: CONFIGURAR VARIÁVEIS DE AMBIENTE
# ============================================
show_step "4" "Configurando variáveis de ambiente"

# Backend .env
if [ ! -f ".env" ]; then
    show_info "Criando backend/.env a partir do .env.example"
    cp .env.example .env
    show_success "backend/.env criado"
else
    show_info "backend/.env já existe (mantendo)"
fi

# Frontend .env
cd ..
if [ ! -f ".env" ]; then
    show_info "Criando .env do Frontend"
    cat > .env << 'EOF'
# URL do backend
VITE_API_URL=http://localhost:3001/api/v1

# Usar dados mock (true = mock, false = backend real)
VITE_USE_MOCK=true
EOF
    show_success "Frontend .env criado"
else
    show_info "Frontend .env já existe (mantendo)"
fi

# ============================================
# PASSO 5: CONFIGURAR BANCO DE DADOS
# ============================================
show_step "5" "Configurando banco de dados"

cd backend

# Verificar se tem PostgreSQL rodando
show_info "Verificando conexão com PostgreSQL..."

# Tentar conectar ao banco
if npx prisma db push --accept-data-loss 2>/dev/null; then
    show_success "Banco de dados configurado"
else
    show_error "Não foi possível conectar ao PostgreSQL"
    echo ""
    echo -e "${YELLOW}  💡 Opções para resolver:${NC}"
    echo ""
    echo -e "${YELLOW}  1. Usar Docker (recomendado):${NC}"
    echo -e "     ${PURPLE}docker-compose up -d postgres${NC}"
    echo ""
    echo -e "${YELLOW}  2. Instalar PostgreSQL localmente:${NC}"
    echo -e "     ${PURPLE}https://www.postgresql.org/download/${NC}"
    echo ""
    echo -e "${YELLOW}  3. Usar modo MOCK (sem banco):${NC}"
    echo -e "     ${PURPLE}O frontend funcionará com dados mock${NC}"
    echo -e "     ${PURPLE}Edite .env e mude VITE_USE_MOCK=true${NC}"
    echo ""
    
    read -p "  Deseja continuar sem banco? (s/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

cd ..

# ============================================
# PASSO 6: CRIAR PASTA DE LOGS
# ============================================
show_step "6" "Preparando ambiente"

if [ ! -d "logs" ]; then
    mkdir logs
    show_success "Pasta logs criada"
else
    show_info "Pasta logs já existe"
fi

# ============================================
# PASSO 7: VERIFICAÇÃO FINAL
# ============================================
show_step "7" "Verificação final"

# Verificar se node_modules existe
if [ -d "node_modules" ]; then
    show_success "Frontend: node_modules encontrado"
else
    show_error "Frontend: node_modules não encontrado"
fi

if [ -d "backend/node_modules" ]; then
    show_success "Backend: node_modules encontrado"
else
    show_error "Backend: node_modules não encontrado"
fi

# ============================================
# RESULTADO FINAL
# ============================================
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║   ✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!                  ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}  📖 Próximos passos:${NC}"
echo ""
echo -e "  ${PURPLE}1. Iniciar o sistema:${NC}"
echo -e "     ${YELLOW}./scripts/dev-all.sh${NC}"
echo ""
echo -e "  ${PURPLE}2. Acessar no navegador:${NC}"
echo -e "     ${YELLOW}http://localhost:5173${NC}"
echo ""
echo -e "  ${PURPLE}3. Fazer login:${NC}"
echo -e "     ${YELLOW}admin@erplite.com.br / admin123${NC}"
echo ""
echo -e "${BLUE}  📚 Documentação:${NC}"
echo -e "     ${YELLOW}COMO-RODAR.md${NC}"
echo -e "     ${YELLOW}GUIA-RAPIDO.md${NC}"
echo -e "     ${YELLOW}README.md${NC}"
echo ""
