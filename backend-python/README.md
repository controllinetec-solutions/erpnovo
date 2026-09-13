# ERP Lite - Backend Python (FastAPI)

Backend do ERP Lite desenvolvido em Python com FastAPI.

## 🚀 Tecnologias

- **FastAPI** - Framework web moderno e rápido
- **SQLAlchemy** - ORM para banco de dados
- **Alembic** - Migrações de banco
- **Pydantic** - Validação de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Pytest** - Testes

## 📦 Instalação

```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Configurar banco de dados
alembic upgrade head

# Rodar o servidor
uvicorn app.main:app --reload
```

## 🔧 Configuração

Copie `.env.example` para `.env` e configure:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/erp_lite
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

## 🧪 Testes

```bash
pytest
```

## 📚 Documentação da API

Acesse: http://localhost:8000/docs

## 🏗️ Estrutura

```
backend/
├── app/
│   ├── main.py              # FastAPI app
│   ├── api/                 # Rotas
│   ├── core/                # Configurações
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── services/            # Lógica de negócio
│   └── utils/               # Utilitários
├── alembic/                 # Migrações
├── tests/                   # Testes
└── requirements.txt
```

## 📄 Licença

MIT
