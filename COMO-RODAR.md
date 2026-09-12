# 🚀 Como Rodar o ERP Lite

Guia completo para iniciar o Frontend e Backend do ERP Lite.

---

## 📋 Opções Disponíveis

| Opção | Quando Usar | Complexidade |
|-------|-------------|--------------|
| **1. Script Automático** | Desenvolvimento local | ⭐ Fácil |
| **2. Terminais Separados** | Controle total | ⭐⭐ Médio |
| **3. Docker Compose** | Ambiente completo | ⭐⭐⭐ Avançado |

---

## 🎯 Opção 1: Script Automático (RECOMENDADO)

### Linux / macOS

```bash
# Tornar executável (primeira vez)
chmod +x scripts/dev-all.sh

# Rodar frontend + backend
./scripts/dev-all.sh
```

### Windows

```bash
# Rodar frontend + backend
scripts\dev-all.bat
```

### O que acontece:
1. ✅ Instala dependências do Frontend
2. ✅ Instala dependências do Backend
3. ✅ Configura banco de dados
4. ✅ Popula com dados iniciais
5. ✅ Inicia Backend (porta 3001)
6. ✅ Inicia Frontend (porta 5173)

### Resultado:
```
🌐 Frontend: http://localhost:5173
🔌 Backend:  http://localhost:3001
📊 API:      http://localhost:3001/api/v1
```

### Para Parar:
- **Linux/macOS**: `Ctrl+C` no terminal
- **Windows**: Feche as janelas dos terminais

---

## 🔧 Opção 2: Terminais Separados

### Passo 1: Frontend (Terminal 1)

```bash
# Na raiz do projeto
npm install
npm run dev
```

✅ Frontend rodando em: **http://localhost:5173**

### Passo 2: Backend (Terminal 2)

```bash
# Abrir NOVO terminal e entrar na pasta backend
cd backend

# Instalar dependências
npm install

# Configurar banco de dados
npx prisma generate
npx prisma migrate dev

# Popular com dados iniciais (primeira vez)
npm run db:seed

# Rodar o servidor
npm run dev
```

✅ Backend rodando em: **http://localhost:3001**

### Para Parar:
- Pressione `Ctrl+C` em cada terminal

---

## 🐳 Opção 3: Docker Compose (Ambiente Completo)

### Pré-requisitos
- [Docker](https://www.docker.com/products/docker-desktop) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

### Rodar Tudo

```bash
# Na raiz do projeto
docker-compose up -d
```

✅ Tudo rodando:
- **Frontend**: http://localhost
- **Backend**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:5050

### Comandos Úteis

```bash
# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Parar tudo
docker-compose down

# Parar e remover volumes (resetar banco)
docker-compose down -v

# Reconstruir imagens
docker-compose up -d --build

# Reiniciar um serviço
docker-compose restart backend
```

### pgAdmin (Interface do Banco)

1. Acesse: http://localhost:5050
2. Login:
   - Email: `admin@erplite.com.br`
   - Senha: `admin123`
3. Conecte ao banco:
   - Host: `postgres`
   - Port: `5432`
   - Database: `erp_lite`
   - User: `erp_user`
   - Password: `erp_password`

---

## 📊 Comparação das Opções

| Recurso | Script Automático | Terminais Separados | Docker |
|---------|-------------------|---------------------|--------|
| **Facilidade** | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| **Controle** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Setup Inicial** | Automático | Manual | Automático |
| **Banco de Dados** | Local | Local | Container |
| **Portabilidade** | Linux/Mac/Win | Todos | Todos |
| **Performance** | Nativa | Nativa | ~5% overhead |
| **Isolamento** | Parcial | Nenhum | Total |

---

## 🔍 Verificar se Está Rodando

### Frontend
```bash
# Acessar no navegador
http://localhost:5173

# Ou via curl
curl http://localhost:5173
```

### Backend
```bash
# Health check
curl http://localhost:3001/health

# Deve retornar:
# {"status":"ok","timestamp":"...","version":"1.0.0"}
```

### Banco de Dados (Docker)
```bash
# Verificar se PostgreSQL está rodando
docker-compose ps postgres

# Conectar ao banco
docker-compose exec postgres psql -U erp_user -d erp_lite
```

---

## 🐛 Troubleshooting

### Problema: "Port 5173 already in use"

**Solução:**
```bash
# Encontrar processo usando a porta
lsof -i :5173  # Linux/Mac
netstat -ano | findstr :5173  # Windows

# Matar o processo
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows

# Ou usar outra porta
npm run dev -- --port 5174
```

### Problema: "Port 3001 already in use"

**Solução:**
```bash
# Encontrar processo
lsof -i :3001  # Linux/Mac
netstat -ano | findstr :3001  # Windows

# Matar o processo
kill -9 <PID>
```

### Problema: "Cannot connect to database"

**Solução:**
```bash
# Verificar se PostgreSQL está rodando
docker-compose ps postgres

# Se não estiver, iniciar
docker-compose up -d postgres

# Verificar DATABASE_URL no backend/.env
cat backend/.env | grep DATABASE_URL
```

### Problema: "Module not found" ou "Cannot find module"

**Solução:**
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install

# No backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Problema: "Migration failed"

**Solução:**
```bash
# Resetar banco (apenas desenvolvimento!)
cd backend
npx prisma migrate reset

# Ou deletar e recriar
npx prisma migrate dev --name init
```

---

## 📝 Comandos Úteis

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
npm run dev

# Build
npm run build

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
docker-compose exec postgres psql -U erp_user -d erp_lite
```

---

## 🎯 Fluxo de Trabalho Recomendado

### Desenvolvimento Diário

```bash
# 1. Iniciar tudo
./scripts/dev-all.sh  # ou scripts\dev-all.bat no Windows

# 2. Trabalhar no código
# - Alterações no frontend: hot reload automático
# - Alterações no backend: hot reload automático

# 3. Testar
# - Frontend: http://localhost:5173
# - API: http://localhost:3001/api/v1

# 4. Parar quando terminar
# Ctrl+C (Linux/Mac) ou fechar terminais (Windows)
```

### Primeiro Acesso

1. Acesse: http://localhost:5173
2. Faça login com:
   - **Admin**: admin@erplite.com.br / admin123
   - **Gerente**: gerente@erplite.com.br / gerente123
   - **Operador**: operador@erplite.com.br / operador123

---

## 📚 Documentação Adicional

- [Guia Rápido](./GUIA-RAPIDO.md)
- [Manual do Desenvolvedor](./docs/MANUAL-DESENVOLVEDOR.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)
- [Guia de Deploy](./docs/GUIA-DEPLOY.md)

---

## 🆘 Suporte

Se tiver problemas:

1. Verifique os [logs](#troubleshooting)
2. Consulte o [Troubleshooting](./docs/TROUBLESHOOTING.md)
3. Abra uma [issue](https://github.com/seu-usuario/erp-lite/issues)

---

**ERP Lite** - Rodando em 3, 2, 1... 🚀
