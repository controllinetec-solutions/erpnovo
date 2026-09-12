@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║   🔍 ERP Lite - Verificação de Pré-requisitos           ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

set ERRORS=0

REM ============================================
REM 1. VERIFICAR NODE.JS
REM ============================================
echo [1/5] Verificando Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo   ❌ Node.js não encontrado
    echo      📥 Instale em: https://nodejs.org/
    set /a ERRORS+=1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo   ✅ Node.js !NODE_VERSION! instalado
)

REM ============================================
REM 2. VERIFICAR NPM
REM ============================================
echo [2/5] Verificando npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo   ❌ npm não encontrado
    set /a ERRORS+=1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo   ✅ npm !NPM_VERSION! instalado
)

REM ============================================
REM 3. VERIFICAR DOCKER (opcional)
REM ============================================
echo [3/5] Verificando Docker...
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo   ⚠️  Docker não encontrado (opcional)
) else (
    for /f "tokens=*" %%i in ('docker --version') do echo   ✅ %%i
)

REM ============================================
REM 4. VERIFICAR ESTRUTURA DO PROJETO
REM ============================================
echo [4/5] Verificando estrutura do projeto...

if not exist "package.json" (
    echo   ❌ package.json não encontrado
    echo      💡 Execute este script na raiz do projeto
    set /a ERRORS+=1
) else (
    echo   ✅ package.json encontrado
)

if not exist "backend" (
    echo   ❌ Pasta backend não encontrada
    set /a ERRORS+=1
) else (
    echo   ✅ Pasta backend encontrada
)

if not exist "backend\package.json" (
    echo   ❌ backend\package.json não encontrado
    set /a ERRORS+=1
) else (
    echo   ✅ backend\package.json encontrado
)

REM ============================================
REM 5. VERIFICAR PORTAS
REM ============================================
echo [5/5] Verificando portas disponíveis...

netstat -ano | findstr ":5173 " >nul 2>nul
if %errorlevel% equ 0 (
    echo   ❌ Porta 5173 (Frontend) já está em uso
    set /a ERRORS+=1
) else (
    echo   ✅ Porta 5173 (Frontend) disponível
)

netstat -ano | findstr ":3001 " >nul 2>nul
if %errorlevel% equ 0 (
    echo   ❌ Porta 3001 (Backend) já está em uso
    set /a ERRORS+=1
) else (
    echo   ✅ Porta 3001 (Backend) disponível
)

REM ============================================
REM RESULTADO FINAL
REM ============================================
echo.
echo ══════════════════════════════════════════════════════════

if %ERRORS% equ 0 (
    echo.
    echo   ✅ TODOS OS PRÉ-REQUISITOS ESTÃO OK!
    echo.
    echo   Você pode prosseguir com a instalação.
    echo.
    echo ══════════════════════════════════════════════════════════
    echo.
    echo   📖 Próximo passo:
    echo      scripts\instalar.bat
    echo.
    exit /b 0
) else (
    echo.
    echo   ❌ ENCONTRADOS %ERRORS% PROBLEMA(S)
    echo.
    echo   Corrija os problemas acima antes de continuar.
    echo.
    echo ══════════════════════════════════════════════════════════
    echo.
    exit /b 1
)
