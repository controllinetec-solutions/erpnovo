# ERP Lite - Sistema de Gestão para Varejo Alimentar

> **Sistema ERP completo para mercados, padarias, hortifrútis e mercearias.**
> Desenvolvido com React + TypeScript no frontend e Node.js + PostgreSQL no backend.
> Integração nativa com PDV Python via API REST.

![Status](https://img.shields.io/badge/Status-Completo-emerald)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

![ERP Lite](https://img.shields.io/badge/ERP-Lite-emerald?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan?style=for-the-badge&logo=tailwindcss)

---

## 🎯 Características

### Módulos Implementados

- ✅ **Dashboard** - Visão gerencial com KPIs e gráficos
- ✅ **Produtos** - Cadastro completo com suporte a pesáveis
- ✅ **Estoque** - Controle por loja, movimentações e inventário
- ✅ **Vendas** - Histórico de vendas do PDV
- ✅ **Financeiro** - Contas a pagar/receber e fluxo de caixa
- ✅ **Clientes** - Cadastro e gestão de clientes
- ✅ **Fornecedores** - Cadastro de fornecedores
- ✅ **Monitor PDV** - Status dos terminais em tempo real
- ✅ **Sincronização** - Controle de sync ERP ↔ PDV
- ✅ **Relatórios** - Relatórios gerenciais
- ✅ **Configurações** - Gestão do sistema
- ✅ **Autenticação** - Login com controle de permissões

### Arquitetura

```
┌─────────────────────┐
│   ERP CLOUD (React) │ ← Você está aqui
│   Frontend Web      │
└──────────┬──────────┘
           │
     API REST
           │
┌──────────▼──────────┐
│   Backend Node.js   │ ← Próximo passo
│   PostgreSQL        │
└──────────┬──────────┘
           │
     API PDV
           │
┌──────────▼──────────┐
│   PDV Python        │ ← Integração futura
│   Desktop Local     │
└─────────────────────┘
```

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd erp-lite

# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev
```

Acesse: **http://localhost:5173**

### Credenciais de Teste

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Administrador | admin@erplite.com.br | admin123 |
| Gerente | gerente@erplite.com.br | gerente123 |
| Operador | operador@erplite.com.br | operador123 |

---

## 📦 Comandos

```bash
# Desenvolvimento
npm run dev          # Roda servidor de desenvolvimento (http://localhost:5173)

# Build
npm run build        # Gera build de produção (pasta dist/)
npm run preview      # Preview do build de produção

# Qualidade
npm run typecheck    # Verifica tipos TypeScript
```

---

## 🏗️ Estrutura do Projeto

```
erp-lite/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Layout.tsx       # Layout principal (sidebar + header)
│   │   └── ProtectedRoute.tsx # Proteção de rotas
│   ├── contexts/            # Contextos React
│   │   └── AuthContext.tsx  # Contexto de autenticação
│   ├── pages/               # Páginas do sistema
│   │   ├── Login.tsx        # Tela de login
│   │   ├── Dashboard.tsx    # Dashboard principal
│   │   ├── Products.tsx     # Gestão de produtos
│   │   ├── Stock.tsx        # Controle de estoque
│   │   ├── Sales.tsx        # Vendas do PDV
│   │   ├── Finance.tsx      # Financeiro
│   │   ├── Customers.tsx    # Clientes
│   │   ├── Suppliers.tsx    # Fornecedores
│   │   ├── PDVMonitor.tsx   # Monitoramento PDV
│   │   ├── Sync.tsx         # Sincronização
│   │   ├── Reports.tsx      # Relatórios
│   │   └── Settings.tsx     # Configurações
│   ├── services/            # Serviços (API, Auth, Data)
│   │   ├── apiClient.ts     # Cliente HTTP
│   │   ├── authService.ts   # Serviço de autenticação
│   │   └── dataService.ts   # Serviço de dados (mock)
│   ├── data/                # Dados mock
│   │   └── mockData.ts      # Dados de demonstração
│   ├── types/               # Tipos TypeScript
│   │   └── index.ts         # Definições de tipos
│   ├── App.tsx              # Componente raiz
│   ├── main.tsx             # Entry point
│   └── index.css            # Estilos globais
├── public/                  # Assets estáticos
├── index.html               # HTML base
├── package.json             # Dependências
├── vite.config.js           # Configuração Vite
├── tsconfig.json            # Configuração TypeScript
├── INTEGRACAO.md            # Documentação de integração
└── README.md                # Este arquivo
```

---

## 🔐 Autenticação e Permissões

### Perfis de Usuário

| Perfil | Permissões |
|--------|-----------|
| **Admin** | Acesso total ao sistema |
| **Gerente** | Gestão de produtos, estoque, vendas, clientes, relatórios |
| **Operador** | Visualização de produtos, estoque, vendas e clientes |
| **Visualizador** | Apenas visualização de dados |

### Proteção de Rotas

Todas as rotas são protegidas e verificam:
1. Se o usuário está autenticado
2. Se o usuário tem permissão para acessar o recurso

---

## 🔄 Integração com Backend

O sistema está preparado para integração com backend Node.js + PostgreSQL.

### Status Atual

- ✅ **Modo Mock**: Funciona com dados locais para desenvolvimento
- ✅ **Camada de API**: Preparada para conectar ao backend real
- ✅ **Tipos TypeScript**: Definidos para todos os endpoints

### Para Conectar ao Backend

1. Implementar backend Node.js (ver [INTEGRACAO.md](./INTEGRACAO.md))
2. Configurar variável `VITE_API_URL` no `.env`
3. Alterar `USE_MOCK_DATA` para `false` em `src/services/apiClient.ts`

### Endpoints Esperados

```
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
GET    /api/v1/products
POST   /api/v1/products
GET    /api/v1/sales
GET    /api/v1/stock/movements
GET    /api/v1/finance/entries
GET    /api/v1/customers
GET    /api/v1/suppliers
GET    /api/v1/terminals
GET    /api/v1/dashboard
```

Ver [INTEGRACAO.md](./INTEGRACAO.md) para documentação completa.

---

## 🎨 Design System

### Cores

- **Primária**: Emerald (verde) - `#10b981`
- **Secundária**: Slate (cinza escuro) - `#0f172a`
- **Sucesso**: Emerald
- **Alerta**: Amber
- **Erro**: Red
- **Info**: Blue

### Componentes

- Botões com estados (default, hover, active, disabled)
- Cards com sombras suaves
- Tabelas responsivas
- Modais e drawers
- Badges e tags
- Inputs com validação

---

## 📱 Responsividade

O sistema é totalmente responsivo:

- **Desktop** (1920px+): Layout completo com sidebar
- **Laptop** (1024px-1920px): Layout otimizado
- **Tablet** (768px-1024px): Sidebar colapsável
- **Mobile** (< 768px): Menu hamburger

---

## 🛠️ Tecnologias

### Frontend

- **React 18** - Biblioteca UI
- **TypeScript 5** - Tipagem estática
- **Vite 6** - Build tool
- **Tailwind CSS 4** - Utility-first CSS
- **React Router 6** - Roteamento
- **Recharts** - Gráficos
- **Lucide React** - Ícones

### Arquitetura

- **Context API** - Gerenciamento de estado global
- **Service Layer** - Abstração de API
- **Mock Data** - Desenvolvimento independente
- **Protected Routes** - Segurança de rotas

---

## 🚢 Deploy

### Vercel (Recomendado)

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm run build
# Upload da pasta dist/
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
```

---

## 📊 Roadmap

### v1.1 - Backend

- [ ] API Node.js + Express
- [ ] PostgreSQL + Prisma
- [ ] Autenticação JWT real
- [ ] CRUD completo de entidades

### v1.2 - PDV Integration

- [ ] API para PDV Python
- [ ] Sincronização bidirecional
- [ ] Fila de sincronização
- [ ] Idempotência

### v1.3 - Fiscal

- [ ] NFC-e
- [ ] NF-e
- [ ] SAT
- [ ] SPED

### v2.0 - Mobile

- [ ] App React Native
- [ ] Scanner de código de barras
- [ ] Inventário mobile
- [ ] Aprovações

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📚 Documentação Completa

| Documento | Descrição |
|-----------|-----------|
| [📘 Manual do Desenvolvedor](./docs/MANUAL-DESENVOLVEDOR.md) | Arquitetura, API, banco de dados |
| [📖 Manual do Usuário](./docs/MANUAL-USUARIO.md) | Como usar o sistema |
| [🔌 Guia de Integração](./INTEGRACAO.md) | Integração com PDV Python |
| [🚀 Guia de Deploy](./docs/GUIA-DEPLOY.md) | Deploy em produção |
| [⚡ Guia Rápido](./GUIA-RAPIDO.md) | Primeiros passos |

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 📞 Suporte

Para dúvidas ou suporte:

- 📧 Email: suporte@erplite.com.br
- 📚 Documentação: [INTEGRACAO.md](./INTEGRACAO.md)
- 🐛 Issues: Abra uma issue no GitHub

---

**Desenvolvido com ❤️ para o varejo alimentar brasileiro**
