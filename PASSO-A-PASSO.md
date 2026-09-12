# 📘 GUIA PASSO A PASSO - ERP Lite

## Guia Completo de Instalação e Execução Local

Este guia vai te levar do zero até o ERP Lite rodando 100% no seu computador, sem faltar nada.

---

## 📋 Índice

1. [Instalar Pré-requisitos](#1-instalar-pré-requisitos)
2. [Baixar o Projeto](#2-baixar-o-projeto)
3. [Verificar Pré-requisitos](#3-verificar-pré-requisitos)
4. [Instalar Dependências](#4-instalar-dependências)
5. [Configurar Banco de Dados](#5-configurar-banco-de-dados)
6. [Rodar o Sistema](#6-rodar-o-sistema)
7. [Primeiro Acesso](#7-primeiro-acesso)
8. [Verificar se Tudo Funciona](#8-verificar-se-tudo-funciona)
9. [Troubleshooting](#9-troubleshooting)

---

## 🎯 Resumo Rápido (Para quem tem pressa)

Se você já tem Node.js 18+ instalado e quer apenas rodar:

```bash
# Linux/Mac
chmod +x scripts/instalar.sh
./scripts/instalar.sh
./scripts/dev-all.sh

# Windows
scripts\instalar.bat
scripts\dev-all.bat
```

Depois acesse: **http://localhost:5173**

---

## 1. Instalar Pré-requisitos

### 1.1. Instalar Node.js (OBRIGATÓRIO)

**O que é:** Node.js é o ambiente que roda JavaScript fora do navegador.

**Versão necessária:** 18 ou superior

#### No Windows:

1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS** (recomendada)
3. Execute o instalador
4. Clique em "Next" até finalizar
5. **IMPORTANTE:** Marque a opção "Add to PATH"

#### No macOS:

```bash
# Opção 1: Usando Homebrew (recomendado)
brew install node

# Opção 2: Download direto
# Acesse: https://nodejs.org/
```

#### No Linux (Ubuntu/Debian):

```bash
# Usando NodeSource (recomendado)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version  # Deve mostrar v20.x.x ou superior
npm --version   # Deve mostrar 10.x.x ou superior
```

### 1.2. Verificar se o Node.js foi instalado

Abra um **novo terminal** e digite:

```bash
node --version
```

**✅ Resultado esperado:**
```
v20.11.0
```

```bash
npm --version
```

**✅ Resultado esperado:**
```
10.2.4
```

❌ **Se der erro "command not found":**
- Reinicie o computador
- Ou adicione o Node.js ao PATH manualmente

### 1.3. Instalar Docker (OPCIONAL - Recomendado)

**O que é:** Docker permite rodar o banco de dados PostgreSQL sem instalar manualmente.

#### No Windows/Mac:

1. Acesse: https://www.docker.com/products/docker-desktop/
2. Baixe o **Docker Desktop**
3. Instale e inicie o Docker Desktop
4. Aguarde o ícone aparecer na barra de tarefas

#### No Linux:

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# Adicionar seu usuário ao grupo docker
sudo usermod -aG docker $USER

# Reinicie o computador ou faça logout/login
```

### 1.4. Instalar Git (OPCIONAL)

**O que é:** Git é usado para clonar o projeto.

#### No Windows:

1. Acesse: https://git-scm.com/download/win
2. Baixe e instale
3. Use as opções padrão

#### No macOS:

```bash
# Já vem instalado, ou:
brew install git
```

#### No Linux:

```bash
sudo apt-get install git
```

---

## 2. Baixar o Projeto

### Opção A: Via Git (Recomendado)

```bash
# Navegue até a pasta onde quer salvar o projeto
cd ~/projetos  # ou onde preferir

# Clonar o repositório
git clone https://github.com/seu-usuario/erp-lite.git

# Entrar na pasta
cd erp-lite
```

### Opção B: Download Direto

1. Acesse o link do projeto
2. Clique em "Code" → "Download ZIP"
3. Extraia o ZIP
4. Renomeie a pasta para `erp-lite`
5. Abra o terminal na pasta do projeto

### Verificar se está na pasta correta

```bash
# Deve mostrar arquivos como:
ls

# ✅ Arquivos esperados:
# package.json
# README.md
# src/
# backend/
# scripts/
# docker-compose.yml
```

---

## 3. Verificar Pré-requisitos

### 3.1. Executar script de verificação

```bash
# Linux/Mac
chmod +x scripts/check-prerequisites.sh
./scripts/check-prerequisites.sh

# Windows
scripts\check-prerequisites.bat
```

### 3.2. Interpretar o resultado

**✅ Se tudo estiver OK:**
```
╔══════════════════════════════════════════════════════════╗
║   ✅ TODOS OS PRÉ-REQUISITOS ESTÃO OK!                  ║
╚══════════════════════════════════════════════════════════╝
```

➡️ **Pule para o passo 4**

**❌ Se houver erros:**
```
╔══════════════════════════════════════════════════════════╗
║   ❌ ENCONTRADOS X PROBLEMA(S)                          ║
╚══════════════════════════════════════════════════════════╝
```

➡️ **Volte ao passo 1 e corrija os problemas**

---

## 4. Instalar Dependências

### Opção A: Instalação Automática (Recomendado)

```bash
# Linux/Mac
chmod +x scripts/instalar.sh
./scripts/instalar.sh

# Windows
scripts\instalar.bat
```

**O que este script faz:**
1. ✅ Verifica pré-requisitos
2. ✅ Instala dependências do Frontend
3. ✅ Instala dependências do Backend
4. ✅ Configura variáveis de ambiente
5. ✅ Configura banco de dados
6. ✅ Cria estrutura de logs

### Opção B: Instalação Manual

Se preferir fazer manualmente:

#### 4.1. Instalar dependências do Frontend

```bash
# Na raiz do projeto
npm install
```

**✅ Resultado esperado:**
```
added 500 packages in 30s
```

**Tempo estimado:** 1-3 minutos

#### 4.2. Instalar dependências do Backend

```bash
# Entrar na pasta backend
cd backend

# Instalar dependências
npm install
```

**✅ Resultado esperado:**
```
added 300 packages in 20s
```

**Tempo estimado:** 1-2 minutos

#### 4.3. Voltar para a raiz

```bash
cd ..
```

### 4.4. Verificar se tudo foi instalado

```bash
# Verificar Frontend
ls node_modules  # Deve mostrar centenas de pastas

# Verificar Backend
ls backend/node_modules  # Deve mostrar centenas de pastas
```

---

## 5. Configurar Banco de Dados

### Opção A: Usando Docker (MAIS FÁCIL)

```bash
# Subir apenas o PostgreSQL
docker-compose up -d postgres

# Verificar se está rodando
docker-compose ps postgres
```

**✅ Resultado esperado:**
```
NAME                STATUS
erp-lite-postgres-1 Up
```

### Opção B: PostgreSQL Local

Se você já tem PostgreSQL instalado:

1. Crie o banco de dados:

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar usuário
CREATE USER erp_user WITH PASSWORD 'erp_password';

# Criar banco
CREATE DATABASE erp_lite OWNER erp_user;

# Sair
\q
```

2. Editar `backend/.env` e ajustar `DATABASE_URL`:

```env
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/erp_lite"
```

### Opção C: Modo Mock (Sem Banco)

Se não quiser usar banco de dados, o frontend funcionará com dados mock:

1. Editar `.env` na raiz:

```env
VITE_USE_MOCK=true
```

2. O backend não será necessário

### 5.1. Configurar Prisma (Se usar banco)

```bash
# Entrar na pasta backend
cd backend

# Gerar Prisma Client
npx prisma generate
```

**✅ Resultado esperado:**
```
✔ Generated Prisma Client
```

```bash
# Aplicar migrações
npx prisma db push
```

**✅ Resultado esperado:**
```
Your database is now in sync with your Prisma schema.
```

```bash
# Popular com dados iniciais
npm run db:seed
```

**✅ Resultado esperado:**
```
🌱 Iniciando seed do banco de dados...
✅ Tenant criado: Mercado Silva
✅ Empresa criada: Mercado Silva Ltda
✅ Lojas criadas: Loja 01 - Centro Loja 02 - Bairro Norte
✅ Usuários criados: Admin Master Maria Silva Carlos Oliveira
✅ Categorias criadas: 7
✅ Produtos criados: 3
✅ Terminais criados: 3

🎉 Seed concluído com sucesso!
```

```bash
# Voltar para a raiz
cd ..
```

---

## 6. Rodar o Sistema

### Opção A: Script Automático (RECOMENDADO)

```bash
# Linux/Mac
chmod +x scripts/dev-all.sh
./scripts/dev-all.sh

# Windows
scripts\dev-all.bat
```

**✅ Resultado esperado:**
```
╔══════════════════════════════════════════════════════════╗
║   ✅ ERP Lite rodando com sucesso!                      ║
║                                                          ║
║   🌐 Frontend: http://localhost:5173                    ║
║   🔌 Backend:  http://localhost:3001                    ║
║   📊 API:      http://localhost:3001/api/v1             ║
╚══════════════════════════════════════════════════════════╝
```

### Opção B: Terminais Separados

**Terminal 1 - Frontend:**

```bash
# Na raiz do projeto
npm run dev
```

**✅ Resultado esperado:**
```
  VITE v6.3.5  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Terminal 2 - Backend:**

```bash
# Abrir NOVO terminal
cd backend
npm run dev
```

**✅ Resultado esperado:**
```
╔══════════════════════════════════════════════════════════╗
║   🚀 ERP Lite Backend - Servidor Iniciado!              ║
║                                                          ║
║   📍 Porta: 3001                                        ║
║   🌐 Ambiente: development                              ║
║   🔗 URL: http://localhost:3001                         ║
║   📚 API: http://localhost:3001/api/v1                  ║
╚══════════════════════════════════════════════════════════╝
```

### Opção C: Docker (Tudo de Uma Vez)

```bash
docker-compose up -d
```

**✅ Resultado esperado:**
```
[+] Running 4/4
 ✔ Container erp-lite-postgres-1  Started
 ✔ Container erp-lite-backend-1   Started
 ✔ Container erp-lite-frontend-1  Started
 ✔ Container erp-lite-pgadmin-1   Started
```

---

## 7. Primeiro Acesso

### 7.1. Abrir o navegador

Acesse: **http://localhost:5173**

### 7.2. Tela de Login

Você verá a tela de login do ERP Lite.

### 7.3. Fazer Login

Use uma das credenciais:

| Perfil | E-mail | Senha | Permissões |
|--------|--------|-------|------------|
| **Administrador** | admin@erplite.com.br | admin123 | Acesso total |
| **Gerente** | gerente@erplite.com.br | gerente123 | Gestão completa |
| **Operador** | operador@erplite.com.br | operador123 | Apenas visualização |

**💡 Dica:** Clique nas credenciais na tela de login para preencher automaticamente!

### 7.4. Dashboard

Após login, você verá o Dashboard com:
- 📊 KPIs (Faturamento, Ticket Médio, etc)
- 📈 Gráficos de vendas
- 🖥️ Status dos PDVs
- 📦 Produtos mais vendidos

---

## 8. Verificar se Tudo Funciona

### 8.1. Testar Frontend

```bash
# No navegador, acesse:
http://localhost:5173

# Deve mostrar a tela de login
```

### 8.2. Testar Backend

```bash
# No terminal:
curl http://localhost:3001/health
```

**✅ Resultado esperado:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T14:30:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

### 8.3. Testar API

```bash
# Listar produtos (requer autenticação)
curl http://localhost:3001/api/v1/products
```

**❌ Resultado esperado (sem token):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token de acesso não fornecido"
  }
}
```

✅ Isso é normal! A API requer autenticação.

### 8.4. Testar Funcionalidades

No navegador, teste:

1. ✅ **Login** - Faça login com admin@erplite.com.br / admin123
2. ✅ **Dashboard** - Veja os KPIs e gráficos
3. ✅ **Produtos** - Clique em "Produtos" no menu
4. ✅ **Estoque** - Clique em "Estoque" no menu
5. ✅ **Vendas** - Clique em "Vendas" no menu
6. ✅ **Financeiro** - Clique em "Financeiro" no menu

---

## 9. Troubleshooting

### Problema: "Port 5173 already in use"

**Causa:** Outra aplicação está usando a porta 5173.

**Solução:**

```bash
# Linux/Mac
lsof -i :5173
kill -9 <PID>

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Ou use outra porta
npm run dev -- --port 5174
```

### Problema: "Port 3001 already in use"

**Solução:**

```bash
# Linux/Mac
lsof -i :3001
kill -9 <PID>

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Problema: "Cannot find module"

**Causa:** Dependências não instaladas.

**Solução:**

```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
cd ..
```

### Problema: "Database connection failed"

**Causa:** PostgreSQL não está rodando.

**Solução:**

```bash
# Se usar Docker
docker-compose up -d postgres

# Verificar
docker-compose ps postgres

# Se usar PostgreSQL local
sudo systemctl start postgresql  # Linux
brew services start postgresql   # Mac
```

### Problema: "Migration failed"

**Solução:**

```bash
cd backend

# Resetar banco (apenas desenvolvimento!)
npx prisma migrate reset

# Ou forçar sync
npx prisma db push --accept-data-loss

cd ..
```

### Problema: Página em branco no navegador

**Solução:**

1. Abra o Console (F12)
2. Veja se há erros
3. Verifique se o backend está rodando
4. Verifique o `VITE_API_URL` no `.env`

### Problema: "EACCES: permission denied"

**Solução:**

```bash
# Linux/Mac
sudo chown -R $USER:$USER .

# Windows
# Execute o terminal como administrador
```

---

## 📚 Comandos Úteis

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Verificar tipos
npm run typecheck
```

### Backend

```bash
# Desenvolvimento
cd backend
npm run dev

# Testes
npm test

# Banco de dados
npx prisma studio          # Visualizar dados
npx prisma migrate dev     # Criar migração
npx prisma migrate reset   # Resetar banco
npm run db:seed            # Popular dados
```

### Docker

```bash
# Iniciar tudo
docker-compose up -d

# Parar tudo
docker-compose down

# Ver logs
docker-compose logs -f

# Reiniciar serviço
docker-compose restart backend

# Executar comando no container
docker-compose exec backend npm run db:seed
```

---

## 🎯 Checklist Final

Antes de começar a desenvolver, verifique:

- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (frontend e backend)
- [ ] Banco de dados configurado (ou modo mock ativo)
- [ ] Frontend rodando em http://localhost:5173
- [ ] Backend rodando em http://localhost:3001
- [ ] Login funcionando com admin@erplite.com.br / admin123
- [ ] Dashboard carregando corretamente
- [ ] Módulos acessíveis pelo menu

---

## 🆘 Suporte

Se tiver problemas:

1. 📖 Consulte este guia
2. 📖 Consulte [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
3. 📖 Consulte [COMO-RODAR.md](./COMO-RODAR.md)
4. 📧 Entre em contato: suporte@erplite.com.br

---

## 🎉 Pronto!

Se você chegou até aqui e tudo está funcionando, **parabéns!** 🎊

O ERP Lite está pronto para desenvolvimento.

**Próximos passos:**
- Explore os módulos
- Leia o [Manual do Usuário](./docs/MANUAL-USUARIO.md)
- Leia o [Manual do Desenvolvedor](./docs/MANUAL-DESENVOLVEDOR.md)
- Comece a desenvolver!

---

**ERP Lite** - Agora é com você! 🚀
