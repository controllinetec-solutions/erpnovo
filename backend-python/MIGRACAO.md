# 🔄 Guia de Migração: Node.js para Python

## 📋 Visão Geral

Este guia explica como migrar o backend do ERP Lite de Node.js (Express) para Python (FastAPI).

---

## 🎯 Por que Migrar para Python?

### Vantagens do Python

- ✅ **Código mais legível** - Sintaxe clara e concisa
- ✅ **Ecossistema rico** - Bibliotecas para tudo (ML, análise de dados, etc)
- ✅ **FastAPI moderno** - Async nativo, validação automática, documentação
- ✅ **SQLAlchemy maduro** - ORM poderoso e flexível
- ✅ **Comunidade ativa** - Grande comunidade e suporte
- ✅ **Tipagem opcional** - Python 3.11+ com type hints

### Vantagens do FastAPI

- ✅ **Performance** - Tão rápido quanto Node.js
- ✅ **Documentação automática** - Swagger UI e ReDoc
- ✅ **Validação automática** - Pydantic integrado
- ✅ **Type hints** - Suporte nativo a tipagem
- ✅ **Async nativo** - Suporte completo a async/await

---

## 📊 Comparação de Tecnologias

| Aspecto | Node.js (Express) | Python (FastAPI) |
|---------|-------------------|------------------|
| **Linguagem** | JavaScript/TypeScript | Python |
| **Framework** | Express | FastAPI |
| **ORM** | Prisma | SQLAlchemy |
| **Validação** | Zod | Pydantic |
| **Migrações** | Prisma Migrate | Alembic |
| **Documentação** | Manual | Automática (Swagger) |
| **Performance** | Alta | Alta |
| **Curva de aprendizado** | Média | Baixa |

---

## 🏗️ Estrutura Comparativa

### Node.js (Antigo)

```
backend/
├── src/
│   ├── main.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── products/
│   │   └── ...
│   └── shared/
├── prisma/
│   └── schema.prisma
└── package.json
```

### Python (Novo)

```
backend-python/
├── app/
│   ├── main.py
│   ├── api/v1/endpoints/
│   ├── core/
│   ├── models/
│   ├── schemas/
│   └── utils/
├── alembic/
├── scripts/
└── requirements.txt
```

---

## 🔄 Mapeamento de Conceitos

### Models

**Node.js (Prisma):**
```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role
  createdAt DateTime @default(now())
}
```

**Python (SQLAlchemy):**
```python
class User(Base):
    __tablename__ = "users"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
```

### Routes

**Node.js (Express):**
```typescript
router.get('/products', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json({ success: true, data: products });
});
```

**Python (FastAPI):**
```python
@router.get("/products")
async def list_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product))
    products = result.scalars().all()
    return {"success": True, "data": products}
```

### Validation

**Node.js (Zod):**
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
```

**Python (Pydantic):**
```python
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
```

---

## 📝 Passos da Migração

### 1. Criar Estrutura Python

```bash
mkdir backend-python
cd backend-python

# Criar ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install fastapi uvicorn sqlalchemy pydantic python-jose passlib
```

### 2. Definir Models

Criar models SQLAlchemy equivalentes aos models Prisma:

- User
- Company, Store
- Product, Category, Brand
- Sale, SaleItem, SalePayment
- StockItem, StockMovement
- Customer, Supplier
- Terminal

### 3. Criar Schemas Pydantic

Para cada model, criar schemas de:
- Create (entrada)
- Update (atualização)
- Response (saída)

### 4. Implementar Endpoints

Migrar cada endpoint do Node.js para Python:

- Auth (login, logout, refresh)
- Products (CRUD)
- Sales (list, get)
- Customers (CRUD)
- Suppliers (CRUD)
- PDV Integration

### 5. Configurar Autenticação

Implementar JWT com python-jose:
- Criar tokens
- Validar tokens
- Middleware de autenticação

### 6. Migrar Dados

```bash
# Exportar dados do Node.js
# Importar para Python
python scripts/seed.py
```

### 7. Testar

```bash
# Testar endpoints
pytest

# Testar manualmente
curl http://localhost:8000/api/v1/products
```

---

## 🔌 Integração com Frontend

O frontend React continua funcionando sem alterações!

### Configurar URL da API

Editar `.env` do frontend:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Endpoints Compatíveis

Todos os endpoints mantêm a mesma estrutura:

```
POST /api/v1/auth/login
GET  /api/v1/products
POST /api/v1/pdv/sales
```

---

## 🚀 Deploy

### Docker

```bash
# Build da imagem
docker build -t erp-lite-python .

# Executar container
docker run -p 8000:8000 erp-lite-python
```

### Produção

```bash
# Usar Gunicorn com Uvicorn workers
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

---

## 📚 Recursos Adicionais

### Documentação

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [Pydantic Docs](https://docs.pydantic.dev/)

### Exemplos

- [FastAPI Examples](https://github.com/tiangolo/fastapi/tree/master/docs_src)
- [SQLAlchemy Examples](https://docs.sqlalchemy.org/en/20/orm/examples.html)

---

## ✅ Checklist de Migração

- [ ] Estrutura Python criada
- [ ] Models SQLAlchemy definidos
- [ ] Schemas Pydantic criados
- [ ] Endpoints implementados
- [ ] Autenticação JWT configurada
- [ ] Integração PDV migrada
- [ ] Testes implementados
- [ ] Documentação atualizada
- [ ] Frontend configurado
- [ ] Deploy configurado

---

## 🎯 Benefícios da Migração

### Para Desenvolvedores

- ✅ Código mais legível e manutenível
- ✅ Documentação automática
- ✅ Validação automática de dados
- ✅ Type hints nativos
- ✅ Ecossistema Python rico

### Para o Negócio

- ✅ Mesma performance
- ✅ Mais fácil contratar desenvolvedores Python
- ✅ Melhor integração com ML/AI
- ✅ Comunidade maior
- ✅ Mais bibliotecas disponíveis

---

## 🆘 Suporte

Se tiver dúvidas na migração:

1. Consulte a documentação do FastAPI
2. Veja os exemplos no código
3. Entre em contato com a equipe

---

**ERP Lite Python** - Backend moderno e escalável! 🚀
