# ERP Lite Backend

API REST do sistema ERP Lite para varejo alimentar. Desenvolvido com Node.js, Express, TypeScript e Prisma.

## 🚀 Tecnologias

- **Node.js 20+**
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL 16** - Banco de dados
- **JWT** - Autenticação
- **Zod** - Validação de dados
- **Vitest** - Testes

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Executar migrações
npx prisma migrate dev

# Popular banco com dados iniciais
npm run db:seed
```

## 🔧 Configuração

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Principais variáveis:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/erp_lite"
JWT_SECRET="sua-chave-secreta-minimo-32-caracteres"
FRONTEND_URL="http://localhost:5173"
PORT=3001
```

## 🏃 Executar

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes com coverage
npm run test:coverage

# Testes em watch mode
npm run test:watch
```

## 📚 Documentação da API

### Autenticação

```
POST /api/v1/auth/login          # Login
POST /api/v1/auth/refresh        # Renovar token
POST /api/v1/auth/logout         # Logout
GET  /api/v1/auth/me             # Usuário atual
```

### Produtos

```
GET    /api/v1/products          # Listar
GET    /api/v1/products/:id      # Obter
POST   /api/v1/products          # Criar
PUT    /api/v1/products/:id      # Atualizar
DELETE /api/v1/products/:id      # Deletar
```

### Integração PDV

```
POST /api/v1/pdv/auth            # Autenticar PDV
GET  /api/v1/pdv/products        # Obter produtos
GET  /api/v1/pdv/products/changes # Alterações incrementais
POST /api/v1/pdv/sales           # Enviar venda
PUT  /api/v1/pdv/sales/cancel    # Cancelar venda
POST /api/v1/pdv/sync            # Sincronização
```

### Outros Endpoints

```
GET /api/v1/sales                # Vendas
GET /api/v1/stock                # Estoque
GET /api/v1/customers            # Clientes
GET /api/v1/suppliers            # Fornecedores
GET /api/v1/finance/entries      # Financeiro
GET /api/v1/purchases            # Compras
GET /api/v1/cash/registers       # Caixa
GET /api/v1/terminals            # Terminais
GET /api/v1/dashboard            # Dashboard
GET /api/v1/fiscal/documents     # Fiscal
GET /api/v1/sync/queue           # Fila de sync
```

## 🗄️ Banco de Dados

### Comandos Prisma

```bash
# Criar nova migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações pendentes
npx prisma migrate deploy

# Resetar banco (apenas desenvolvimento)
npx prisma migrate reset

# Visualizar dados
npx prisma studio
```

### Schema

O schema completo está em `prisma/schema.prisma` com 25+ tabelas:

- Tenant, Company, Store
- User, Category, Brand
- Product, StockItem, StockMovement
- Sale, SaleItem, SalePayment
- CashRegister, CashMovement
- Customer, Supplier
- PurchaseOrder, PurchaseItem
- FinancialEntry
- Terminal, SyncQueue, SyncConflict
- FiscalDocument, AuditLog

## 🔒 Segurança

- ✅ JWT com refresh tokens
- ✅ Senhas com bcrypt
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Helmet (security headers)
- ✅ Validação com Zod
- ✅ SQL injection prevention (Prisma)
- ✅ Multi-tenant isolation
- ✅ Audit logs

## 📊 Monitoramento

```bash
# Health check
GET /health

# Logs
# Desenvolvimento: console
# Produção: configurar Sentry/Datadog
```

## 🐳 Docker

```bash
# Build da imagem
docker build -t erp-lite-backend .

# Executar container
docker run -p 3001:3001 --env-file .env erp-lite-backend
```

## 📝 Estrutura

```
backend/
├── src/
│   ├── main.ts              # Entry point
│   ├── modules/
│   │   ├── auth/            # Autenticação
│   │   ├── products/        # Produtos
│   │   ├── pdv/             # Integração PDV
│   │   ├── sync/            # Sincronização
│   │   └── routes.ts        # Rotas consolidadas
│   └── shared/
│       ├── database/        # Prisma client
│       └── errors/          # Error handlers
├── prisma/
│   ├── schema.prisma        # Schema do banco
│   └── seed.ts              # Dados iniciais
├── Dockerfile
├── package.json
└── tsconfig.json
```

## 🤝 Contribuindo

Veja [CONTRIBUTING.md](../CONTRIBUTING.md) para detalhes.

## 📄 Licença

MIT

---

**ERP Lite Backend** - API robusta e escalável para varejo alimentar
