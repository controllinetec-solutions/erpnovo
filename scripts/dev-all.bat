@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║   🚀 ERP Lite - Iniciando Frontend + Backend            ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Verificar se está na raiz do projeto
if not exist "package.json" (
    echo ⚠️  Execute este script na raiz do projeto
    pause
    exit /b 1
)

REM Verificar se backend existe
if not exist "backend" (
    echo ⚠️  Pasta backend não encontrada
    pause
    exit /b 1
)

echo 📦 Instalando dependências do Frontend...
call npm install --silent

echo 📦 Instalando dependências do Backend...
cd backend
call npm install --silent

echo 🗄️  Configurando banco de dados...
call npx prisma generate --silent
call npx prisma migrate dev --name init --silent

echo 🌱 Populando banco com dados iniciais...
call npm run db:seed --silent

cd ..

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║   ✅ Configuração concluída! Iniciando servidores...    ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Criar pasta de logs se não existir
if not exist "logs" mkdir logs

echo 🚀 Iniciando Backend...
start "ERP-Lite-Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo 🎨 Iniciando Frontend...
start "ERP-Lite-Frontend" cmd /k "npm run dev"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║   ✅ ERP Lite rodando com sucesso!                      ║
echo ║                                                          ║
echo ║   🌐 Frontend: http://localhost:5173                    ║
echo ║   🔌 Backend:  http://localhost:3001                    ║
echo ║   📊 API:      http://localhost:3001/api/v1             ║
echo ║                                                          ║
echo ║   🛑 Feche as janelas dos terminais para parar          ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
pause
