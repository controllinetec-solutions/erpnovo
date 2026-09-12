# 🚀 Guia Rápido - ERP Lite

## Como Rodar Localmente

### 1. Instalar Dependências

```bash
npm install
```

### 2. Rodar em Modo Desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:5173**

### 3. Fazer Login

Use uma das credenciais de demonstração:

| Perfil | E-mail | Senha |
|--------|--------|-------|
| **Administrador** | admin@erplite.com.br | admin123 |
| **Gerente** | gerente@erplite.com.br | gerente123 |
| **Operador** | operador@erplite.com.br | operador123 |

💡 **Dica**: Clique nas credenciais na tela de login para preencher automaticamente!

---

## O que Testar

### 1. Dashboard
- ✅ Veja os KPIs (faturamento, ticket médio, vendas)
- ✅ Gráficos de vendas por dia e categoria
- ✅ Produtos mais vendidos
- ✅ Status dos PDVs

### 2. Produtos
- ✅ Liste todos os produtos
- ✅ Busque por nome, código de barras ou código interno
- ✅ Filtre por categoria
- ✅ Clique em "Novo Produto" para ver o formulário
- ✅ Veja produtos pesáveis (balança) e não-pesáveis

### 3. Estoque
- ✅ Veja a posição de estoque
- ✅ Identifique produtos com estoque baixo (⚠️)
- ✅ Veja movimentações (entradas, saídas, transferências)
- ✅ Verifique o valor total em estoque

### 4. Vendas
- ✅ Liste vendas do PDV
- ✅ Veja detalhes de cada venda
- ✅ Identifique vendas pendentes de sincronização
- ✅ Filtre por status (concluídas, canceladas)

### 5. Financeiro
- ✅ Veja contas a pagar e receber
- ✅ Identifique títulos vencidos
- ✅ Veja o fluxo de caixa
- ✅ Saldo previsto (receitas - despesas)

### 6. Monitor PDV
- ✅ Veja status dos terminais (🟢 online, 🟡 sincronizando, 🔴 offline)
- ✅ Identifique vendas pendentes
- ✅ Veja a fila de sincronização
- ✅ Endpoints da API

### 7. Sincronização
- ✅ Veja o log de sincronização
- ✅ Entenda o fluxo ERP ↔ PDV
- ✅ Veja estatísticas de sync

### 8. Relatórios
- ✅ Explore categorias de relatórios
- ✅ Veja relatórios disponíveis (vendas, estoque, compras, financeiro)

### 9. Configurações
- ✅ Dados da empresa
- ✅ Usuários e permissões
- ✅ Configuração da API PDV
- ✅ Notificações
- ✅ Backup
- ✅ Segurança

---

## Funcionalidades de Autenticação

### Login
- Acesse http://localhost:5173
- Você será redirecionado para /login
- Use as credenciais de demonstração

### Logout
- Clique no seu nome no canto superior direito
- Clique em "Sair do Sistema"

### Proteção de Rotas
- Tente acessar uma rota sem estar logado → redireciona para login
- Tente acessar uma rota sem permissão → mostra "Acesso Negado"

### Perfis de Usuário
- **Admin**: Acesso total
- **Gerente**: Gestão completa (exceto configurações avançadas)
- **Operador**: Apenas visualização

---

## Próximos Passos

### Para Desenvolvedores

1. **Explorar o código**
   - `src/pages/` - Páginas do sistema
   - `src/services/` - Camada de API
   - `src/contexts/` - Contextos React
   - `src/types/` - Tipos TypeScript

2. **Modificar dados mock**
   - Edite `src/data/mockData.ts`
   - Adicione seus próprios produtos, vendas, etc.

3. **Conectar ao backend real**
   - Leia `INTEGRACAO.md`
   - Implemente o backend Node.js
   - Altere `USE_MOCK_DATA` para `false`

### Para Testar com Backend Real

1. Crie um arquivo `.env` na raiz:

```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_USE_MOCK=false
```

2. Implemente o backend (ver `INTEGRACAO.md`)

3. Rode o frontend novamente:

```bash
npm run dev
```

---

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Roda servidor de desenvolvimento

# Build
npm run build        # Gera build de produção
npm run preview      # Preview do build

# Qualidade
npm run typecheck    # Verifica tipos TypeScript
```

---

## Problemas Comuns

### Página em branco
- Abra o console (F12) e veja os erros
- Verifique se `npm install` foi executado

### Erro de login
- Use as credenciais corretas (veja tabela acima)
- Verifique se não há espaços extras

### Dados não aparecem
- O sistema usa dados mock por padrão
- Verifique `src/data/mockData.ts`

### Build falha
- Execute `npm run typecheck` para ver erros de tipo
- Limpe a pasta `node_modules` e rode `npm install` novamente

---

## Estrutura de Arquivos Importantes

```
src/
├── App.tsx                    # Rotas e providers
├── pages/
│   ├── Login.tsx              # Tela de login
│   ├── Dashboard.tsx          # Dashboard principal
│   └── ...                    # Outras páginas
├── components/
│   ├── Layout.tsx             # Layout com sidebar
│   └── ProtectedRoute.tsx     # Proteção de rotas
├── contexts/
│   └── AuthContext.tsx        # Autenticação
├── services/
│   ├── apiClient.ts           # Cliente HTTP
│   ├── authService.ts         # Serviço de auth
│   └── dataService.ts         # Serviço de dados
└── data/
    └── mockData.ts            # Dados mock
```

---

## Suporte

- 📚 Documentação completa: `INTEGRACAO.md`
- 📖 README: `README.md`
- 🐛 Problemas: Abra uma issue

---

**Divirta-se testando o ERP Lite!** 🎉
