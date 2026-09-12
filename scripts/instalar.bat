@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║   📦 ERP Lite - Instalação Completa                     ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM ============================================
REM PASSO 1: VERIFICAR PRÉ-REQUISITOS
REM ============================================
echo ══════════════════════════════════════════════════════════
echo   📍 PASSO 1: Verificando pré-requisitos
echo ══════════════════════════════════════════════════════════
echo.

REM Verificar Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo   ❌ Node.js não encontrado
    echo      Instale em: https://nodejs.org/
    pause
    exit /b 1
)
echo   ✅ Node.js encontrado

REM Verificar npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo   ❌ npm não encontrado
    pause
    exit /b 1
)
echo   ✅ npm encontrado

REM ============================================
REM PASSO 2: INSTALAR DEPENDÊNCIAS DO FRONTEND
REM ============================================
echo.
echo ══════════════════════════════════════════════════════════
echo   📍 PASSO 2: Instalando dependências do Frontend
echo ══════════════════════════════════════════════════════════
echo.

echo   📦 Executando: npm install
echo.

call npm install
if %errorlevel% neq 0 (
    echo   ❌ Falha ao instalar dependências do Frontend
    pause
    exit /b 1
)
echo   ✅ Dependências do Frontend instaladas

REM ============================================
REM PASSO 3: INSTALAR DEPENDÊNCIAS DO BACKEND
REM ============================================
echo.
echo ══════════════════════════════════════════════════════════
echo   📍 PASSO 3: Instalando dependências do Backend
echo ══════════════════════════════════════════════════════════
echo.

echo   📦 Executando: cd backend ^&^& npm install
echo.

cd backend
call npm install
if %errorlevel% neq 0 (
    echo   ❌ Falha ao instalar dependências do Backend
    pause
    exit /b 1
)
echo   ✅ Dependências do Backend instaladas

REM ============================================
REM PASSO 4: CONFIGURAR VARIÁVEIS DE AMBIENTE
REM ============================================
echo.
echo ══════════════════════════════════════════════════════════
echo   📍 PASSO 4: Configurando variáveis de ambiente
echo ══════════════════════════════════════════════════════════
echo.

REM Backend .env
if not exist ".env" (
    echo   ℹ️  Criando backend/.env a partir do .env.example
    copy .env.example .env >nul
    echo   ✅ backend/.env criado
) else (
    echo   ℹ️  backend/.env já existe (mantendo)
)

REM Frontend .env
cd ..
if not exist ".env" (
    echo   ℹ️  Criando .env do Frontend
    (
        echo # URL do backend
        echo VITE_API_URL=http://localhost:3001/api/v1
        echo.
        echo # Usar dados mock (true = mock, false = backend real)
        echo VITE_USE_MOCK=true
    ) > .env
    echo   ✅ Frontend .env criado
) else (
    echo   ℹ️  Frontend .env já existe (mantendo)
)

REM ============================================
REM PASSO 5: CONFIGURAR BANCO DE DADOS
REM ============================================
echo.
echo ══════════════════════════════════════════════════════════
echo   📍 PASSO 5: Configurando banco de dados
echo ══════════════════════════════════════════════════════════
echo.

cd backend

echo   ℹ️  Verificando conexão com PostgreSQL...
echo.
echo   💡 Opções para configurar o banco:
echo.
echo   1. Usar Docker (recomendado):
echo      docker-compose up -d postgres
echo.
echo   2. Usar PostgreSQL local:
echo      Edite backend/.env e ajuste DATABASE_URL
echo.
echo   3. Usar modo MOCK (sem banco):
echo      O frontend funcionará com dados mock
echo.

set /p CONTINUE="  Deseja continuar sem configurar banco? (s/n): "
if /i not "%CONTINUE%"=="s" (
    echo.
    echo   Configure o banco de dados e execute novamente.
    pause
    exit /b 1
)

cd ..

REM ============================================
REM PASSO 6: CRIAR PASTA DE LOGS
REM ============================================
echo.
echo ══════════════════════════════════════════════════════════
echo   📍 PASSO 6: Preparando ambiente
echo ══════════════════════════════════════════════════════════
echo.

if not exist "logs" (
    mkdir logs
    echo   ✅ Pasta logs criada
) else (
    echo   ℹ️  Pasta logs já existe
)

REM ============================================
REM PASSO 7: VERIFICAÇÃO FINAL
REM ============================================
echo.
echo ══════════════════════════════════════════════════════════
echo   📍 PASSO 7: Verificação final
echo ══════════════════════════════════════════════════════════
echo.

REM Verificar se node_modules existe
if exist "node_modules" (
    echo   ✅ Frontend: node_modules encontrado
) else (
    echo   ❌ Frontend: node_modules não encontrado
)

if exist "backend\node_modules" (
    echo   ✅ Backend: node_modules encontrado
) else (
    echo   ❌ Backend: node_modules não encontrado
)

REM ============================================
REM RESULTADO FINAL
REM ============================================
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║   ✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!                  ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo   📖 Próximos passos:
echo.
echo   1. Iniciar o sistema:
echo      scripts\dev-all.bat
echo.
echo   2. Acessar no navegador:
echo      http://localhost:5173
echo.
echo   3. Fazer login:
echo      admin@erplite.com.br / admin123
echo.
echo   📚 Documentação:
echo      PASSO-A-PASSO.md
echo      COMO-RODAR.md
echo      GUIA-RAPIDO.md
echo      README.md
echo.
pause
