#!/bin/bash

# ============================================
# ERP Lite - Script para rodar Frontend + Backend
# ============================================

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║   🚀 ERP Lite - Iniciando Frontend + Backend            ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se está na raiz do projeto
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}⚠️  Execute este script na raiz do projeto${NC}"
    exit 1
fi

# Verificar se backend existe
if [ ! -d "backend" ]; then
    echo -e "${YELLOW}⚠️  Pasta backend não encontrada${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Instalando dependências do Frontend...${NC}"
npm install --silent

echo -e "${BLUE}📦 Instalando dependências do Backend...${NC}"
cd backend
npm install --silent

echo -e "${BLUE}🗄️  Configurando banco de dados...${NC}"
npx prisma generate --silent
npx prisma migrate dev --name init --silent

echo -e "${BLUE}🌱 Populando banco com dados iniciais...${NC}"
npm run db:seed --silent

cd ..

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ Configuração concluída! Iniciando servidores...    ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo -e "${YELLOW}⚠️  Parando servidores...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Iniciar Backend
echo -e "${BLUE}🔧 Iniciando Backend...${NC}"
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Aguardar backend iniciar
sleep 3

# Iniciar Frontend
echo -e "${BLUE}🎨 Iniciando Frontend...${NC}"
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║   ✅ ERP Lite rodando com sucesso!                      ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║   🌐 Frontend: http://localhost:5173                    ║${NC}"
echo -e "${GREEN}║   🔌 Backend:  http://localhost:3001                    ║${NC}"
echo -e "${GREEN}║   📊 API:      http://localhost:3001/api/v1             ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║   📝 Logs:                                              ║${NC}"
echo -e "${GREEN}║      Frontend: logs/frontend.log                        ║${NC}"
echo -e "${GREEN}║      Backend:  logs/backend.log                         ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║   🛑 Pressione Ctrl+C para parar                        ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Aguardar processos
wait
