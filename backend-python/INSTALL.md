# 🚀 ERP Lite Python - Instalação Rápida

## ⚡ Instalação em 3 Passos

### 1. Executar Setup Automático

```bash
cd backend-python
chmod +x setup.sh
./setup.sh
```

### 2. Iniciar Servidor

```bash
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

### 3. Acessar

- **API**: http://localhost:8000
- **Documentação**: http://localhost:8000/docs
- **Frontend**: http://localhost:5173 (aponte para porta 8000)

---

## 🔐 Credenciais Padrão

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | admin@erplite.com.br | admin123 |
| Gerente | gerente@erplite.com.br | gerente123 |
| Operador | operador@erplite.com.br | operador123 |

---

## 🐳 Usando Docker

```bash
# Na raiz do projeto
docker-compose -f docker-compose-python.yml up -d

# Acessar:
# Frontend: http://localhost
# Backend: http://localhost:8000
# pgAdmin: http://localhost:5050
```

---

## 📋 Endpoints Principais

### Autenticação
```bash
POST /api/v1/auth/login
POST /api/v1/auth/refresh
GET  /api/v1/auth/me
```

### Produtos
```bash
GET    /api/v1/products
POST   /api/v1/products
PUT    /api/v1/products/{id}
DELETE /api/v1/products/{id}
```

### Vendas
```bash
GET /api/v1/sales
GET /api/v1/sales/{id}
```

### Estoque
```bash
GET  /api/v1/stock
GET  /api/v1/stock/movements
POST /api/v1/stock/adjustment
```

### Integração PDV
```bash
POST /api/v1/pdv/auth
GET  /api/v1/pdv/products
POST /api/v1/pdv/sales
PUT  /api/v1/pdv/sales/cancel
POST /api/v1/pdv/sync
```

---

## 🧪 Testes

```bash
# Executar testes
pytest

# Com coverage
pytest --cov=app
```

---

## 📚 Documentação

- **GUIA-USO.md** - Guia completo de uso
- **MIGRACAO.md** - Guia de migração Node.js → Python
- **README-FINAL.md** - Resumo do projeto
- **API Docs** - http://localhost:8000/docs

---

## 🆘 Troubleshooting

### Erro: "asyncpg not found"
```bash
pip install asyncpg
```

### Erro: "Cannot connect to database"
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Ou usar Docker
docker-compose -f docker-compose-python.yml up -d postgres
```

### Erro: "Module not found"
```bash
pip install -r requirements.txt --force-reinstall
```

---

## ✅ Checklist de Instalação

- [ ] Python 3.11+ instalado
- [ ] Ambiente virtual criado (`python3 -m venv venv`)
- [ ] Dependências instaladas (`pip install -r requirements.txt`)
- [ ] `.env` configurado
- [ ] PostgreSQL rodando
- [ ] Migrations executadas (`alembic upgrade head`)
- [ ] Dados iniciais populados (`python scripts/seed.py`)
- [ ] Servidor rodando (`uvicorn app.main:app --reload`)
- [ ] Documentação acessível (http://localhost:8000/docs)
- [ ] Login funcionando (admin@erplite.com.br / admin123)

---

**ERP Lite Python** - Pronto para uso! 🚀
