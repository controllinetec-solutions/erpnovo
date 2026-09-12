# 📘 Manual do Desenvolvedor - ERP Lite

## 📋 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Configuração do Ambiente](#configuração-do-ambiente)
4. [Backend - API REST](#backend---api-rest)
5. [Banco de Dados](#banco-de-dados)
6. [Autenticação e Autorização](#autenticação-e-autorização)
7. [Integração com PDV Python](#integração-com-pdv-python)
8. [Sincronização](#sincronização)
9. [Módulo Fiscal](#módulo-fiscal)
10. [Deploy](#deploy)

---

## 🏗️ Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                   React + TypeScript + Vite                  │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │Dashboard │ │ Produtos │ │  Vendas  │ │ Financeiro│      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  Caixa   │ │ Compras  │ │  Fiscal  │ │  Estoque │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│                  Node.js + Express + Prisma                  │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │   Auth   │ │ Products │ │  Sales   │ │   PDV    │      │
│  │  Module  │ │  Module  │ │  Module  │ │  Module  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  Sync    │ │ Fiscal   │ │ Finance  │ │  Stock   │      │
│  │  Module  │ │  Module  │ │  Module  │ │  Module  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ SQL
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL 16                           │
│                                                              │
│  Multi-tenant │ Audit Logs │ Sync Queue │ Fiscal Docs       │
└─────────────────────────────────────────────────────────────┘
                         ▲
                         │ API REST
┌────────────────────────┴────────────────────────────────────┐
│                     PDV Python Desktop                       │
│                                                              │
│  Operação Local │ Fila Sync │ Offline │ Balança │ TEF       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura do Projeto

```
erp-lite/
├── src/                          # Frontend React
│   ├── components/               # Componentes reutilizáveis
│   │   ├── Layout.tsx           # Layout principal
│   │   └── ProtectedRoute.tsx   # Proteção de rotas
│   ├── contexts/
│   │   └── AuthContext.tsx      # Contexto de autenticação
│   ├── pages/                   # Páginas do sistema
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Products.tsx
│   │   ├── Stock.tsx
│   │   ├── Sales.tsx
│   │   ├── Cash.tsx
│   │   ├── Purchases.tsx
│   │   ├── Finance.tsx
│   │   ├── Fiscal.tsx
│   │   ├── Customers.tsx
│   │   ├── Suppliers.tsx
│   │   ├── PDVMonitor.tsx
│   │   ├── Sync.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── services/                # Camada de API
│   │   ├── apiClient.ts        # Cliente HTTP
│   │   ├── authService.ts      # Serviço de auth
│   │   └── dataService.ts      # Serviço de dados
│   ├── data/                    # Dados mock
│   │   ├── mockData.ts
│   │   └── purchasesCashData.ts
│   ├── types/                   # Tipos TypeScript
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
│
├── backend/                     # Backend Node.js
│   ├── src/
│   │   ├── main.ts             # Entry point
│   │   ├── modules/
│   │   │   ├── auth/           # Autenticação JWT
│   │   │   ├── products/       # CRUD produtos
│   │   │   ├── pdv/            # Integração PDV
│   │   │   ├── sync/           # Fila de sincronização
│   │   │   └── routes.ts       # Rotas consolidadas
│   │   └── shared/
│   │       ├── database/       # Prisma client
│   │       └── errors/         # Error handlers
│   ├── prisma/
│   │   └── schema.prisma       # Schema do banco
│   ├── Dockerfile
│   └── package.json
│
├── .github/workflows/           # CI/CD
├── docker-compose.yml           # Docker Compose
├── Dockerfile.frontend          # Docker frontend
├── nginx.conf                   # Configuração Nginx
└── package.json
```

---

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- Node.js 20+
- PostgreSQL 16+
- Docker e Docker Compose (opcional)

### Variáveis de Ambiente

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_USE_MOCK=false
```

#### Backend (.env)
```env
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/erp_lite
JWT_SECRET=sua-chave-secreta-min-32-caracteres
FRONTEND_URL=http://localhost:5173
PORT=3001
```

### Instalação

```bash
# Frontend
npm install

# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Com Docker

```bash
docker-compose up -d
```

---

## 🔌 Backend - API REST

### Endpoints Principais

#### Autenticação
```
POST   /api/v1/auth/login          # Login
POST   /api/v1/auth/refresh        # Renovar token
POST   /api/v1/auth/logout         # Logout
GET    /api/v1/auth/me             # Usuário atual
```

#### Produtos
```
GET    /api/v1/products            # Listar
GET    /api/v1/products/:id        # Obter
POST   /api/v1/products            # Criar
PUT    /api/v1/products/:id        # Atualizar
DELETE /api/v1/products/:id        # Deletar (soft)
```

#### Vendas
```
GET    /api/v1/sales               # Listar
GET    /api/v1/sales/:id           # Obter
```

#### Estoque
```
GET    /api/v1/stock               # Posição atual
GET    /api/v1/stock/movements     # Movimentações
```

#### Clientes
```
GET    /api/v1/customers           # Listar
POST   /api/v1/customers           # Criar
```

#### Fornecedores
```
GET    /api/v1/suppliers           # Listar
POST   /api/v1/suppliers           # Criar
```

#### Financeiro
```
GET    /api/v1/finance/entries     # Lançamentos
```

#### Compras
```
GET    /api/v1/purchases           # Pedidos
```

#### Caixa
```
GET    /api/v1/cash/registers      # Caixas
```

#### Terminais
```
GET    /api/v1/terminals           # Terminais PDV
```

#### Dashboard
```
GET    /api/v1/dashboard           # Dados do dashboard
```

#### Fiscal
```
GET    /api/v1/fiscal/documents    # Documentos fiscais
```

#### Sincronização
```
GET    /api/v1/sync/queue          # Fila
GET    /api/v1/sync/conflicts      # Conflitos
POST   /api/v1/sync/force          # Forçar sync
GET    /api/v1/sync/stats          # Estatísticas
```

### Integração PDV
```
POST   /api/v1/pdv/auth            # Autenticar PDV
GET    /api/v1/pdv/products        # Obter produtos
GET    /api/v1/pdv/products/changes # Alterações incrementais
GET    /api/v1/pdv/customers       # Obter clientes
POST   /api/v1/pdv/sales           # Enviar venda (idempotente)
PUT    /api/v1/pdv/sales/cancel    # Cancelar venda
POST   /api/v1/pdv/sync            # Sincronização completa
```

---

## 🗄️ Banco de Dados

### Schema Principal

O banco utiliza **PostgreSQL** com **Prisma ORM** e suporta **multi-tenancy**.

#### Tabelas Principais

- **Tenant** - Empresas (multi-tenant)
- **Company** - Dados da empresa
- **Store** - Filiais/lojas
- **User** - Usuários do sistema
- **Product** - Produtos
- **Category** - Categorias
- **Brand** - Marcas
- **StockItem** - Saldo de estoque
- **StockMovement** - Movimentações
- **Sale** - Vendas
- **SaleItem** - Itens da venda
- **SalePayment** - Pagamentos
- **CashRegister** - Caixas
- **Customer** - Clientes
- **Supplier** - Fornecedores
- **PurchaseOrder** - Pedidos de compra
- **FinancialEntry** - Lançamentos financeiros
- **Terminal** - Terminais PDV
- **SyncQueue** - Fila de sincronização
- **FiscalDocument** - Documentos fiscais
- **AuditLog** - Logs de auditoria
- **SyncConflict** - Conflitos de sync

### Multi-Tenancy

Todas as consultas são filtradas por `companyId` para garantir isolamento entre tenants.

### Soft Delete

Produtos utilizam soft delete com campo `deletedAt`.

### Versionamento

Produtos possuem campo `version` para sincronização incremental.

---

## 🔐 Autenticação e Autorização

### JWT Tokens

- **Access Token**: 1 hora de validade
- **Refresh Token**: 7 dias de validade

### Roles

| Role | Permissões |
|------|-----------|
| ADMIN | Acesso total |
| MANAGER | Gestão completa (exceto configurações avançadas) |
| OPERATOR | Visualização e operações básicas |
| VIEWER | Apenas visualização |

### Permissões Granulares

```typescript
type Permission =
  | 'products.view' | 'products.create' | 'products.edit' | 'products.delete'
  | 'stock.view' | 'stock.adjust'
  | 'sales.view' | 'sales.cancel'
  | 'finance.view' | 'finance.manage'
  | 'customers.view' | 'customers.create' | 'customers.edit'
  | 'suppliers.view' | 'suppliers.create'
  | 'reports.view'
  | 'settings.manage'
  | 'users.manage'
  | 'pdv.monitor';
```

---

## 🔄 Integração com PDV Python

### Fluxo de Autenticação

1. PDV envia token do terminal para `/api/v1/pdv/auth`
2. Backend valida e retorna JWT específico para PDV
3. PDV usa JWT em todas as requisições subsequentes

### Sincronização Incremental

```
PDV → GET /pdv/products/changes?since=2026-01-15T10:00:00Z
ERP → Retorna apenas produtos alterados desde a data
```

### Idempotência

Vendas são identificadas por UUID (`saleId`). Se o PDV enviar a mesma venda duas vezes, o ERP retorna a venda existente.

### Exemplo: Enviar Venda

```json
POST /api/v1/pdv/sales
Authorization: Bearer <pdv-token>

{
  "saleId": "uuid-v4",
  "terminalId": "terminal-uuid",
  "operatorId": "user-uuid",
  "date": "2026-01-15T14:30:00Z",
  "customerId": null,
  "items": [
    {
      "productId": "product-uuid",
      "barcode": "7891000100103",
      "description": "Arroz Camil 5kg",
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
  "subtotal": 49.80,
  "discount": 0,
  "total": 49.80,
  "idempotencyKey": "uuid-v4"
}
```

---

## 🔄 Sincronização

### Fila de Sincronização

Tabela `sync_queue` armazena operações pendentes:

```typescript
model SyncQueue {
  id           String
  uuid         String   @unique
  entity       String   // products, sales, etc
  entityId     String
  operation    String   // CREATE, UPDATE, DELETE
  payload      Json
  status       SyncStatus // PENDING, PROCESSING, SUCCESS, ERROR
  attempts     Int
  errorMessage String?
}
```

### Retry Automático

- Máximo de 5 tentativas
- Backoff exponencial
- Log de erros

### Conflitos

Conflitos são registrados na tabela `sync_conflicts` e podem ser resolvidos manualmente via API.

---

## 🧾 Módulo Fiscal

### Documentos Suportados

- **NFC-e** (Modelo 65) - Nota fiscal de consumidor
- **NF-e** (Modelo 55) - Nota fiscal eletrônica

### Status

- **PENDING** - Aguardando transmissão
- **AUTHORIZED** - Autorizado pela SEFAZ
- **CANCELLED** - Cancelado
- **DENIED** - Denegado pela SEFAZ
- **CONTINGENCY** - Emitido em contingência

### Certificado Digital

- Suporte a A1 e A3
- Validade monitorada
- Renovação automática (futuro)

---

## 🚀 Deploy

### Docker Compose (Recomendado)

```bash
# Desenvolvimento
docker-compose up -d

# Produção
docker-compose -f docker-compose.yml up -d --build
```

### Vercel + Railway

#### Frontend (Vercel)
```bash
vercel --prod
```

#### Backend (Railway)
```bash
# Conectar repositório no Railway
# Configurar variáveis de ambiente
# Deploy automático
```

### Variáveis de Ambiente em Produção

```env
# Frontend
VITE_API_URL=https://api.seudominio.com/api/v1

# Backend
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=chave-secreta-forte-min-32-chars
FRONTEND_URL=https://app.seudominio.com
```

---

## 🧪 Testes

### Backend

```bash
cd backend
npm test              # Testes unitários
npm run test:coverage # Coverage
```

### Frontend

```bash
npm run typecheck     # Verificação de tipos
```

---

## 📊 Monitoramento

### Health Check

```
GET /health
```

### Logs

- Backend: Morgan (HTTP) + Console
- Frontend: Console + Error boundaries

### Métricas (Futuro)

- Prometheus + Grafana
- Sentry para erros
- APM para performance

---

## 🔒 Segurança

### Implementado

- ✅ HTTPS obrigatório
- ✅ JWT com refresh tokens
- ✅ Rate limiting (1000 req/15min)
- ✅ CORS configurado
- ✅ Helmet (security headers)
- ✅ Validação com Zod
- ✅ SQL injection prevention (Prisma)
- ✅ Multi-tenant isolation
- ✅ Audit logs

### Boas Práticas

- ✅ Senhas com bcrypt
- ✅ Tokens com expiração
- ✅ Soft delete para dados importantes
- ✅ Error handling centralizado

---

## 📚 Recursos Adicionais

- [Documentação da API](./API.md)
- [Guia de Integração PDV](./PDV-INTEGRATION.md)
- [Manual do Usuário](./MANUAL-USUARIO.md)
- [Guia de Deploy](./DEPLOY.md)

---

**ERP Lite** - Desenvolvido com ❤️ para o varejo alimentar brasileiro
