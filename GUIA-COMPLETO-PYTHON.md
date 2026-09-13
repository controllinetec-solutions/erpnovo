# 🚀 ERP Lite - Guia Completo com Backend Python

## 📋 Visão Geral

O ERP Lite agora tem **duas opções de backend**:

1. **Node.js (Express)** - Backend original
2. **Python (FastAPI)** - Backend novo e recomendado

Ambos mantêm a mesma API REST, então o frontend React funciona com qualquer um dos dois!

---

## 🎯 Qual Backend Escolher?

### Use Python (FastAPI) se:
- ✅ Prefere código mais legível
- ✅ Quer documentação automática
- ✅ Precisa de validação automática
- ✅ Vai trabalhar com ML/AI no futuro
- ✅ Prefere Python sobre JavaScript

### Use Node.js (Express) se:
- ✅ Já tem experiência com Node.js
- ✅ Quer manter o código original
- ✅ Precisa de compatibilidade total com TypeScript

---

## 🚀 Instalação Rápida

### Opção 1: Backend Python (Recomendado)

```bash
# Entrar na pasta do backend Python
cd backend-python

# Executar script de inicialização
chmod +x start.sh
./start.sh

# Popular banco de dados
python scripts/seed.py

# Iniciar servidor
uvicorn app.main:app --reload --port 8000
```

### Opção 2: Backend Node.js

```bash
# Entrar na pasta do backend Node.js
cd backend

# Instalar dependências
npm install

# Configurar banco de dados
npx prisma generate
npx prisma migrate dev
npm run db:seed

# Iniciar servidor
npm run dev
```

---

## 🔧 Configurar Frontend

### Para Backend Python (porta 8000)

Editar `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_USE_MOCK=false
```

### Para Backend Node.js (porta 3001)

Editar `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_USE_MOCK=false
```

---

## 🏃 Rodar o Sistema Completo

### Passo 1: Iniciar Backend Python

```bash
cd backend-python
uvicorn app.main:app --reload --port 8000
```

### Passo 2: Iniciar Frontend (novo terminal)

```bash
# Na raiz do projeto
npm run dev
```

### Passo 3: Acessar

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Documentação API**: http://localhost:8000/docs

---

## 🔐 Credenciais de Teste

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | admin@erplite.com.br | admin123 |
| Gerente | gerente@erplite.com.br | gerente123 |
| Operador | operador@erplite.com.br | operador123 |

---

## 📊 Comparação de Endpoints

### Autenticação

**Python (FastAPI):**
```bash
POST http://localhost:8000/api/v1/auth/login
```

**Node.js (Express):**
```bash
POST http://localhost:3001/api/v1/auth/login
```

✅ **Mesma estrutura de request/response!**

### Produtos

**Python:**
```bash
GET http://localhost:8000/api/v1/products
```

**Node.js:**
```bash
GET http://localhost:3001/api/v1/products
```

✅ **Mesma estrutura de resposta!**

### Integração PDV

**Python:**
```bash
POST http://localhost:8000/api/v1/pdv/sales
```

**Node.js:**
```bash
POST http://localhost:3001/api/v1/pdv/sales
```

✅ **Mesma API, mesmo comportamento!**

---

## 🐳 Docker (Ambiente Completo)

### Usando Backend Python

```bash
# Subir tudo com Docker
docker-compose up -d

# Acessar:
# Frontend: http://localhost
# Backend Python: http://localhost:8000
# PostgreSQL: localhost:5432
```

---

## 📚 Documentação

### Backend Python
- 📘 [GUIA-USO.md](./backend-python/GUIA-USO.md) - Como usar o backend Python
- 🔄 [MIGRACAO.md](./backend-python/MIGRACAO.md) - Guia de migração Node.js → Python
- 📖 [README-FINAL.md](./backend-python/README-FINAL.md) - Resumo do backend Python

### Backend Node.js
- 📖 [README.md](./backend/README.md) - Documentação do backend Node.js

### Frontend
- 📘 [PASSO-A-PASSO.md](./PASSO-A-PASSO.md) - Guia completo do zero
- 📗 [COMO-RODAR.md](./COMO-RODAR.md) - Como rodar frontend e backend
- 📙 [GUIA-RAPIDO.md](./GUIA-RAPIDO.md) - Primeiros passos

### Geral
- 📕 [README.md](./README.md) - Visão geral do projeto
- 📔 [docs/MANUAL-USUARIO.md](./docs/MANUAL-USUARIO.md) - Manual do usuário
- 📓 [docs/MANUAL-DESENVOLVEDOR.md](./docs/MANUAL-DESENVOLVEDOR.md) - Manual do desenvolvedor

---

## 🎯 Fluxo de Trabalho Recomendado

### Para Desenvolvimento

```bash
# Terminal 1 - Backend Python
cd backend-python
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
npm run dev

# Terminal 3 - Logs (opcional)
tail -f logs/backend.log
```

### Para Produção

```bash
# Build do frontend
npm run build

# Iniciar backend Python em produção
cd backend-python
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Ou usar Docker
docker-compose up -d
```

---

## ✅ Checklist de Instalação

### Backend Python
- [ ] Python 3.11+ instalado
- [ ] Ambiente virtual criado
- [ ] Dependências instaladas (`pip install -r requirements.txt`)
- [ ] `.env` configurado
- [ ] Banco de dados PostgreSQL rodando
- [ ] Tabelas criadas
- [ ] Dados iniciais populados (`python scripts/seed.py`)
- [ ] Servidor rodando (`uvicorn app.main:app --reload`)

### Frontend
- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] `.env` configurado com `VITE_API_URL`
- [ ] Servidor rodando (`npm run dev`)

### Integração
- [ ] Frontend consegue acessar backend
- [ ] Login funciona
- [ ] CRUD de produtos funciona
- [ ] Integração PDV funciona

---

## 🆘 Troubleshooting

### Erro: "Cannot connect to database"

**Solução:**
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Ou usar Docker
docker-compose up -d postgres
```

### Erro: "Port 8000 already in use"

**Solução:**
```bash
# Encontrar processo
lsof -i :8000

# Matar processo
kill -9 <PID>

# Ou usar outra porta
uvicorn app.main:app --reload --port 8001
```

### Erro: "Module not found"

**Solução:**
```bash
# Reinstalar dependências
pip install -r requirements.txt --force-reinstall
```

---

## 📊 Estatísticas do Projeto

### Backend Python
- **14 models** SQLAlchemy
- **20+ endpoints** da API
- **6 schemas** Pydantic
- **Autenticação JWT** completa
- **Integração PDV** com idempotência

### Frontend
- **16 módulos** completos
- **Autenticação** com 3 perfis
- **Proteção de rotas** com permissões
- **Exportação** PDF/Excel

### Documentação
- **10+ manuais** completos
- **Documentação automática** da API (Swagger)
- **Guias** passo a passo

---

## 🎉 Conclusão

O **ERP Lite** está **100% completo** com duas opções de backend:

✅ **Backend Python (FastAPI)** - Moderno, legível, documentação automática
✅ **Backend Node.js (Express)** - Original, TypeScript, Prisma

Ambos mantêm a mesma API REST, então você pode escolher o que preferir!

### Recomendação

Para novos projetos, use **Python (FastAPI)**:
- ✅ Código mais legível
- ✅ Documentação automática
- ✅ Validação automática
- ✅ Ecossistema Python rico
- ✅ Melhor para ML/AI no futuro

---

**ERP Lite** - Sistema completo e flexível! 🚀

**Status: PRODUÇÃO READY** ✅
