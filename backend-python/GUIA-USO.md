# 📘 ERP Lite Python - Guia de Uso

## 🚀 Instalação e Configuração

### Pré-requisitos

- Python 3.11+
- PostgreSQL 14+
- pip

### Instalação Rápida

```bash
# Entrar na pasta do backend Python
cd backend-python

# Tornar script executável
chmod +x start.sh

# Executar script de inicialização
./start.sh
```

### Instalação Manual

```bash
# 1. Criar ambiente virtual
python3 -m venv venv

# 2. Ativar ambiente virtual
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 3. Instalar dependências
pip install -r requirements.txt

# 4. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# 5. Popular banco de dados
python scripts/seed.py

# 6. Iniciar servidor
uvicorn app.main:app --reload --port 8000
```

---

## 🏃 Executando o Servidor

### Modo Desenvolvimento (com hot reload)

```bash
uvicorn app.main:app --reload --port 8000
```

### Modo Produção

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Acessar Documentação

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🗄️ Banco de Dados

### Criar Tabelas

```bash
# Opção 1: Via código Python
python -c "
import asyncio
from app.core.database import engine, Base

async def init():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

asyncio.run(init())
"

# Opção 2: Via Alembic (recomendado para produção)
alembic upgrade head
```

### Popular com Dados Iniciais

```bash
python scripts/seed.py
```

### Resetar Banco

```bash
# Cuidado: Isso apaga todos os dados!
python -c "
import asyncio
from app.core.database import engine, Base

async def reset():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

asyncio.run(reset())
"

# Depois popular novamente
python scripts/seed.py
```

---

## 🔐 Autenticação

### Fazer Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@erplite.com.br",
    "password": "admin123"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-admin",
      "name": "Admin Master",
      "email": "admin@erplite.com.br",
      "role": "admin",
      "permissions": [...]
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 3600
    }
  }
}
```

### Usar Token nas Requisições

```bash
curl -X GET http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## 📦 Endpoints Principais

### Produtos

```bash
# Listar produtos
GET /api/v1/products

# Obter produto
GET /api/v1/products/{id}

# Criar produto
POST /api/v1/products

# Atualizar produto
PUT /api/v1/products/{id}

# Deletar produto
DELETE /api/v1/products/{id}
```

### Vendas

```bash
# Listar vendas
GET /api/v1/sales

# Obter venda
GET /api/v1/sales/{id}
```

### Clientes

```bash
# Listar clientes
GET /api/v1/customers

# Criar cliente
POST /api/v1/customers
```

### Fornecedores

```bash
# Listar fornecedores
GET /api/v1/suppliers

# Criar fornecedor
POST /api/v1/suppliers
```

---

## 🔄 Integração PDV

### Autenticar PDV

```bash
POST /api/v1/pdv/auth
```

### Obter Produtos para PDV

```bash
GET /api/v1/pdv/products?limit=100
```

### Obter Alterações de Produtos

```bash
GET /api/v1/pdv/products/changes?since=2026-01-15T10:00:00Z
```

### Enviar Venda (Idempotente)

```bash
POST /api/v1/pdv/sales
```

**Exemplo:**
```json
{
  "sale_id": "uuid-unico",
  "terminal_id": "terminal-001",
  "operator_id": "user-001",
  "date": "2026-01-15T14:30:00Z",
  "items": [
    {
      "product_id": "prod-001",
      "description": "Arroz Camil 5kg",
      "quantity": 2,
      "unit_price": 24.90,
      "total": 49.80
    }
  ],
  "payments": [
    {
      "type": "PIX",
      "amount": 49.80
    }
  ],
  "subtotal": 49.80,
  "total": 49.80,
  "idempotency_key": "uuid-unico"
}
```

### Cancelar Venda

```bash
PUT /api/v1/pdv/sales/cancel
```

---

## 🧪 Testes

```bash
# Executar todos os testes
pytest

# Executar com coverage
pytest --cov=app

# Executar testes específicos
pytest tests/test_auth.py
```

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"

**Solução:**
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Iniciar PostgreSQL
sudo systemctl start postgresql

# Ou usar Docker
docker-compose up -d postgres
```

### Erro: "Module not found"

**Solução:**
```bash
# Reinstalar dependências
pip install -r requirements.txt --force-reinstall
```

### Erro: "Table already exists"

**Solução:**
```bash
# Resetar banco
python -c "
import asyncio
from app.core.database import engine, Base

async def reset():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

asyncio.run(reset())
"
```

---

## 📚 Documentação da API

Acesse a documentação interativa:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🔒 Credenciais Padrão

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | admin@erplite.com.br | admin123 |
| Gerente | gerente@erplite.com.br | gerente123 |
| Operador | operador@erplite.com.br | operador123 |

---

## 📖 Estrutura do Projeto

```
backend-python/
├── app/
│   ├── main.py              # Aplicação FastAPI
│   ├── api/
│   │   └── v1/
│   │       └── endpoints/   # Rotas da API
│   ├── core/                # Configurações
│   ├── models/              # Models SQLAlchemy
│   ├── schemas/             # Schemas Pydantic
│   └── utils/               # Utilitários
├── scripts/
│   └── seed.py              # Dados iniciais
├── tests/                   # Testes
├── alembic.ini              # Configuração Alembic
├── requirements.txt         # Dependências
└── .env.example             # Variáveis de ambiente
```

---

## 🚀 Próximos Passos

1. ✅ Backend Python criado
2. ✅ Models SQLAlchemy definidos
3. ✅ Endpoints da API implementados
4. ✅ Autenticação JWT configurada
5. ✅ Integração PDV pronta
6. ⏳ Testes unitários
7. ⏳ Documentação completa
8. ⏳ Deploy em produção

---

**ERP Lite Python** - Backend moderno e escalável! 🚀
