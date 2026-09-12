# ERP Lite - Documentação de Integração

## 🚀 Status Atual

O ERP Lite está funcionando com **dados mock** para desenvolvimento e testes. A arquitetura está preparada para integração com backend Node.js + PostgreSQL.

---

## 📋 Próximos Passos para Backend Real

### 1. Configurar Backend Node.js + PostgreSQL

#### Estrutura do Backend

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/          # Autenticação (JWT)
│   │   ├── products/      # CRUD de produtos
│   │   ├── stock/         # Controle de estoque
│   │   ├── sales/         # Vendas do PDV
│   │   ├── finance/       # Contas a pagar/receber
│   │   ├── customers/     # Clientes
│   │   ├── suppliers/     # Fornecedores
│   │   ├── terminals/     # Terminais PDV
│   │   └── sync/          # Sincronização
│   ├── shared/
│   │   ├── database/      # Conexão PostgreSQL
│   │   ├── auth/          # Middleware JWT
│   │   └── errors/        # Tratamento de erros
│   └── main.ts
├── prisma/
│   └── schema.prisma      # Schema do banco
└── package.json
```

#### Tecnologias Recomendadas

- **Node.js** 18+
- **Express** ou **Fastify**
- **PostgreSQL** 14+
- **Prisma** (ORM)
- **JWT** (autenticação)
- **bcrypt** (hash de senhas)
- **zod** (validação)

---

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do frontend:

```env
# URL do backend
VITE_API_URL=http://localhost:3001/api/v1

# Usar dados mock (true = mock, false = backend real)
VITE_USE_MOCK=false
```

---

### 3. Alterar Flag de Mock Data

No arquivo `src/services/apiClient.ts`, altere:

```typescript
// De:
export const USE_MOCK_DATA = true;

// Para:
export const USE_MOCK_DATA = false;
```

---

### 4. Endpoints da API Esperados

O frontend espera os seguintes endpoints:

#### Autenticação

```
POST   /api/v1/auth/login          # Login
POST   /api/v1/auth/refresh        # Renovar token
POST   /api/v1/auth/logout         # Logout
GET    /api/v1/auth/me             # Usuário atual
```

**Exemplo de Request (Login):**

```json
POST /api/v1/auth/login
{
  "email": "admin@erplite.com.br",
  "password": "admin123"
}
```

**Exemplo de Response:**

```json
{
  "user": {
    "id": "usr-001",
    "name": "Admin Master",
    "email": "admin@erplite.com.br",
    "role": "admin",
    "storeId": "store-001",
    "storeName": "Loja 01 - Centro",
    "companyId": "comp-001",
    "companyName": "Mercado Silva Ltda",
    "permissions": ["products.view", "products.create", ...],
    "active": true,
    "lastLogin": "2026-01-15T14:30:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

---

#### Produtos

```
GET    /api/v1/products              # Listar produtos
GET    /api/v1/products/:id          # Obter produto
POST   /api/v1/products              # Criar produto
PUT    /api/v1/products/:id          # Atualizar produto
DELETE /api/v1/products/:id          # Deletar produto
```

**Query Parameters:**

```
?search=arroz
?category=Mercearia
?page=1
?limit=20
```

---

#### Vendas

```
GET    /api/v1/sales                 # Listar vendas
GET    /api/v1/sales/:id             # Obter venda
```

---

#### Estoque

```
GET    /api/v1/stock/movements       # Movimentações
POST   /api/v1/stock/entry           # Entrada
POST   /api/v1/stock/exit            # Saída
POST   /api/v1/stock/transfer        # Transferência
```

---

#### Financeiro

```
GET    /api/v1/finance/entries       # Lançamentos
POST   /api/v1/finance/entries       # Criar lançamento
PUT    /api/v1/finance/entries/:id   # Atualizar
```

---

#### Clientes

```
GET    /api/v1/customers             # Listar
POST   /api/v1/customers             # Criar
PUT    /api/v1/customers/:id         # Atualizar
```

---

#### Fornecedores

```
GET    /api/v1/suppliers             # Listar
POST   /api/v1/suppliers             # Criar
PUT    /api/v1/suppliers/:id         # Atualizar
```

---

#### Terminais PDV

```
GET    /api/v1/terminals             # Listar terminais
GET    /api/v1/terminals/:id         # Obter terminal
```

---

#### Dashboard

```
GET    /api/v1/dashboard             # Dados do dashboard
```

---

### 5. Schema do Banco de Dados (Exemplo Prisma)

```prisma
// prisma/schema.prisma

model User {
  id            String   @id @default(uuid())
  name          String
  email         String   @unique
  passwordHash  String
  role          Role
  storeId       String
  companyId     String
  permissions   String[] // Array de permissões
  active        Boolean  @default(true)
  lastLogin     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  store         Store    @relation(fields: [storeId], references: [id])
  company       Company  @relation(fields: [companyId], references: [id])
}

enum Role {
  ADMIN
  MANAGER
  OPERATOR
  VIEWER
}

model Company {
  id              String   @id @default(uuid())
  name            String
  tradeName       String
  document        String   @unique // CNPJ
  stateRegistration String?
  address         String
  phone           String
  email           String
  segment         String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  users           User[]
  stores          Store[]
}

model Store {
  id              String   @id @default(uuid())
  name            String
  companyId       String
  address         String
  phone           String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  company         Company  @relation(fields: [companyId], references: [id])
  users           User[]
  products        Product[]
  terminals       Terminal[]
}

model Product {
  id              String   @id @default(uuid())
  code            String
  barcode         String   @unique
  description     String
  shortDescription String
  categoryId      String
  brand           String
  unit            String
  ncm             String
  cest            String?
  costPrice       Decimal
  salePrice       Decimal
  margin          Decimal
  minStock        Int
  currentStock    Int
  isWeighable     Boolean  @default(false)
  status          ProductStatus @default(ACTIVE)
  storeId         String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  store           Store    @relation(fields: [storeId], references: [id])
  category        Category @relation(fields: [categoryId], references: [id])
}

enum ProductStatus {
  ACTIVE
  INACTIVE
}

model Sale {
  id              String   @id @default(uuid())
  saleId          String   @unique // UUID do PDV (idempotência)
  storeId         String
  terminalId      String
  operatorId      String
  customerId      String?
  date            DateTime
  items           Json     // Array de itens
  payments        Json     // Array de pagamentos
  total           Decimal
  discount        Decimal  @default(0)
  status          SaleStatus
  synced          Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum SaleStatus {
  COMPLETED
  CANCELLED
  PENDING
}

model Terminal {
  id              String   @id @default(uuid())
  name            String
  storeId         String
  token           String   @unique
  status          TerminalStatus
  lastSync        DateTime
  version         String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  store           Store    @relation(fields: [storeId], references: [id])
}

enum TerminalStatus {
  ONLINE
  OFFLINE
  SYNCING
  ERROR
}

// Adicione mais models conforme necessário:
// - Category
// - Customer
// - Supplier
// - FinancialEntry
// - StockMovement
// - SyncQueue
```

---

### 6. Integrar PDV Python

#### Fluxo de Sincronização

```
PDV Python (Local)
    ↓
Fila de Sincronização (SQLite local)
    ↓
Internet disponível?
    ↓ SIM
API ERP (POST /api/v1/pdv/sync)
    ↓
Confirmação
    ↓
Marcar como sincronizado
```

#### Endpoints para PDV

```
POST   /api/v1/pdv/auth              # Autenticar PDV
GET    /api/v1/pdv/products          # Obter produtos
GET    /api/v1/pdv/products/changes  # Alterações desde último sync
GET    /api/v1/pdv/customers         # Obter clientes
POST   /api/v1/pdv/sales             # Enviar venda
PUT    /api/v1/pdv/sales/cancel      # Cancelar venda
POST   /api/v1/pdv/sync              # Sincronização completa
```

#### Exemplo: Enviar Venda do PDV

```json
POST /api/v1/pdv/sales
Authorization: Bearer <pdv-token>

{
  "saleId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "companyId": "comp-001",
  "storeId": "store-001",
  "terminalId": "term-001",
  "operatorId": "usr-003",
  "date": "2026-01-15T14:30:00Z",
  "customerId": null,
  "items": [
    {
      "productId": "prod-001",
      "barcode": "7891000100103",
      "description": "Arroz Tipo 1 Camil 5kg",
      "quantity": 2,
      "unitPrice": 24.90,
      "discount": 0,
      "total": 49.80,
      "isWeighable": false
    }
  ],
  "payments": [
    {
      "type": "PIX",
      "amount": 49.80
    }
  ],
  "total": 49.80,
  "discount": 0,
  "idempotencyKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 7. Deploy

#### Opções de Deploy

**Frontend:**
- **Vercel** (recomendado)
- **Netlify**
- **AWS S3 + CloudFront**

**Backend:**
- **Railway**
- **Render**
- **AWS EC2 + RDS**
- **DigitalOcean**

#### Deploy na Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

#### Deploy Backend (Exemplo Railway)

1. Criar conta em https://railway.app
2. Criar novo projeto
3. Adicionar PostgreSQL
4. Deploy do backend Node.js
5. Configurar variáveis de ambiente
6. Atualizar `VITE_API_URL` no frontend

---

## 🔐 Segurança

### Autenticação

- **JWT** com tokens de acesso (1h) e refresh (7d)
- **bcrypt** para hash de senhas
- **HTTPS** obrigatório em produção
- **Rate limiting** (1000 req/min por IP)

### Autorização

- **RBAC** (Role-Based Access Control)
- **Permissões granulares** por módulo
- **Multi-tenant** (isolamento por empresa)

### Boas Práticas

- ✅ Validar todos os inputs (zod)
- ✅ Sanitizar dados
- ✅ Usar prepared statements (Prisma)
- ✅ Logs de auditoria
- ✅ Backup automático
- ✅ Monitoramento de erros

---

## 📚 Recursos Adicionais

### Documentação da API

Use **Swagger** ou **OpenAPI** para documentar a API:

```bash
npm install swagger-ui-express
```

### Testes

```bash
# Testes unitários
npm test

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e
```

### Monitoramento

- **Sentry** para erros
- **Datadog** ou **New Relic** para métricas
- **Prometheus + Grafana** para monitoramento

---

## 🆘 Suporte

Para dúvidas ou problemas:

1. Verifique os logs do navegador (F12)
2. Verifique os logs do backend
3. Consulte a documentação da API
4. Entre em contato com a equipe de desenvolvimento

---

## 📝 Changelog

### v1.0.0 (2026-01-15)

- ✅ Frontend React + TypeScript + Tailwind
- ✅ Autenticação com login/senha
- ✅ Proteção de rotas
- ✅ Dados mock para desenvolvimento
- ✅ Preparado para backend Node.js + PostgreSQL
- ✅ Documentação de integração

### Próximas Versões

- [ ] Backend Node.js + Express + PostgreSQL
- [ ] Integração com PDV Python
- [ ] Módulo fiscal (NFC-e, NF-e)
- [ ] Relatórios avançados
- [ ] App mobile

---

**ERP Lite** - Gestão Inteligente para Varejo Alimentar 🚀
