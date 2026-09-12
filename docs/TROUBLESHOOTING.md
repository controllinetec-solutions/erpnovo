# 🔧 Guia de Troubleshooting - ERP Lite

Este guia ajuda a resolver problemas comuns encontrados durante o uso do ERP Lite.

---

## 📋 Índice

1. [Problemas de Instalação](#problemas-de-instalação)
2. [Problemas de Autenticação](#problemas-de-autenticação)
3. [Problemas de Conexão](#problemas-de-conexão)
4. [Problemas de Sincronização](#problemas-de-sincronização)
5. [Problemas de Performance](#problemas-de-performance)
6. [Problemas de Banco de Dados](#problemas-de-banco-de-dados)
7. [Problemas de Deploy](#problemas-de-deploy)
8. [Erros Comuns](#erros-comuns)

---

## 🚀 Problemas de Instalação

### Erro: "npm: command not found"

**Causa:** Node.js não está instalado ou não está no PATH.

**Solução:**
```bash
# Verificar instalação
node --version
npm --version

# Se não estiver instalado, baixe em:
# https://nodejs.org/

# Ou use nvm (recomendado):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### Erro: "Cannot find module"

**Causa:** Dependências não instaladas.

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro: "EACCES: permission denied"

**Causa:** Permissões insuficientes.

**Solução:**
```bash
# No Linux/Mac:
sudo chown -R $USER:$USER .

# No Windows (PowerShell como Admin):
# Execute o terminal como administrador
```

### Erro: "Port 5173 already in use"

**Causa:** Porta já está sendo usada por outro processo.

**Solução:**
```bash
# Encontrar processo usando a porta
lsof -i :5173  # Linux/Mac
netstat -ano | findstr :5173  # Windows

# Matar o processo
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows

# Ou usar outra porta
npm run dev -- --port 5174
```

---

## 🔐 Problemas de Autenticação

### Erro: "E-mail ou senha inválidos"

**Causa:** Credenciais incorretas.

**Solução:**
1. Verifique se está usando as credenciais corretas:
   - Admin: admin@erplite.com.br / admin123
   - Gerente: gerente@erplite.com.br / gerente123
   - Operador: operador@erplite.com.br / operador123

2. Verifique se não há espaços extras
3. Verifique se o Caps Lock está desativado

### Erro: "Token inválido ou expirado"

**Causa:** Sessão expirou ou token corrompido.

**Solução:**
```javascript
// Limpar localStorage manualmente
localStorage.clear();

// Ou fazer logout e login novamente
```

### Erro: "Acesso negado"

**Causa:** Usuário não tem permissão para acessar o recurso.

**Solução:**
1. Verifique o perfil do usuário
2. Contate o administrador para ajustar permissões
3. Verifique se está na loja correta

---

## 🌐 Problemas de Conexão

### Erro: "Network Error" ou "Failed to fetch"

**Causa:** Backend não está rodando ou URL incorreta.

**Solução:**
```bash
# Verificar se o backend está rodando
curl http://localhost:3001/health

# Se não estiver, iniciar o backend
cd backend
npm run dev

# Verificar VITE_API_URL no .env
cat .env | grep VITE_API_URL

# Deve ser: VITE_API_URL=http://localhost:3001/api/v1
```

### Erro: "CORS error"

**Causa:** Backend não permite requisições do frontend.

**Solução:**
```javascript
// No backend/src/main.ts, verificar CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Verificar FRONTEND_URL no .env do backend
```

### Erro: "Timeout"

**Causa:** Requisição demorou muito.

**Solução:**
```javascript
// Aumentar timeout no apiClient.ts
const API_CONFIG: ApiConfig = {
  baseUrl: API_BASE_URL,
  timeout: 10000, // Aumentar para 10 segundos
  retryAttempts: 3,
  retryDelay: 1000,
};
```

---

## 🔄 Problemas de Sincronização

### Vendas não sincronizam

**Causa:** Internet instável ou backend offline.

**Solução:**
1. Verificar conexão com internet
2. Verificar se o backend está online
3. Forçar sincronização:
   - Acesse "Sincronização"
   - Clique em "Forçar Sincronização"
4. Verificar logs do backend

### Produtos não aparecem no PDV

**Causa:** Sincronização não foi executada.

**Solução:**
1. Verificar se o produto está ativo
2. Verificar se está na loja correta
3. Forçar sincronização
4. Reiniciar o PDV

### Estoque incorreto

**Causa:** Vendas não sincronizadas ou estoque não atualizado.

**Solução:**
1. Verificar vendas pendentes
2. Forçar sincronização
3. Verificar movimentações de estoque
4. Realizar inventário se necessário

---

## ⚡ Problemas de Performance

### Sistema lento

**Causa:** Muitos dados ou queries ineficientes.

**Solução:**
```sql
-- Analisar queries lentas
EXPLAIN ANALYZE SELECT * FROM products WHERE store_id = 'xxx';

-- Criar índices
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_sales_date ON sales(date);

-- Limpar dados antigos
DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '1 year';
```

### Build demorado

**Causa:** Muitos arquivos ou dependências.

**Solução:**
```bash
# Limpar cache
rm -rf node_modules/.vite
rm -rf dist

# Rebuild
npm run build

# Usar code splitting (futuro)
```

---

## 🗄️ Problemas de Banco de Dados

### Erro: "Database connection failed"

**Causa:** PostgreSQL não está rodando ou credenciais incorretas.

**Solução:**
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql  # Linux
brew services list  # Mac

# Iniciar PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql  # Mac

# Verificar DATABASE_URL
cat backend/.env | grep DATABASE_URL

# Testar conexão
psql $DATABASE_URL
```

### Erro: "relation does not exist"

**Causa:** Migrações não foram executadas.

**Solução:**
```bash
cd backend
npx prisma migrate deploy

# Ou resetar banco (apenas desenvolvimento)
npx prisma migrate reset
```

### Erro: "Unique constraint violation"

**Causa:** Tentativa de inserir dados duplicados.

**Solução:**
1. Verificar se o registro já existe
2. Usar UPSERT em vez de INSERT
3. Verificar constraints no schema

---

## 🚢 Problemas de Deploy

### Erro: "Build failed"

**Causa:** Erros de TypeScript ou dependências.

**Solução:**
```bash
# Verificar erros
npm run typecheck

# Corrigir erros de tipo
# Rebuild
npm run build
```

### Erro: "Container failed to start"

**Causa:** Configuração incorreta do Docker.

**Solução:**
```bash
# Verificar logs
docker-compose logs backend

# Reconstruir
docker-compose down
docker-compose up -d --build

# Verificar variáveis de ambiente
docker-compose config
```

### Erro: "502 Bad Gateway"

**Causa:** Nginx não consegue conectar ao backend.

**Solução:**
```bash
# Verificar se backend está rodando
docker-compose ps

# Verificar logs do Nginx
docker-compose logs nginx

# Verificar configuração do Nginx
cat nginx.conf
```

---

## ❌ Erros Comuns

### "Cannot read property 'map' of undefined"

**Causa:** Dados não foram carregados ainda.

**Solução:**
```typescript
// Verificar se dados existem antes de renderizar
{data && data.length > 0 ? (
  data.map(item => <div key={item.id}>{item.name}</div>)
) : (
  <p>Nenhum dado encontrado</p>
)}
```

### "Warning: Each child in a list should have a unique 'key' prop"

**Causa:** Falta a prop `key` em listas.

**Solução:**
```typescript
// Adicionar key única
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}
```

### "Module not found: Can't resolve"

**Causa:** Arquivo ou dependência não existe.

**Solução:**
```bash
# Verificar se o arquivo existe
ls src/components/MeuComponente.tsx

# Verificar import
import MeuComponente from './components/MeuComponente';

# Reinstalar dependências
npm install
```

---

## 📞 Suporte

Se o problema persistir:

1. **Verifique os logs**
   - Frontend: Console do navegador (F12)
   - Backend: Terminal onde está rodando
   - Docker: `docker-compose logs`

2. **Consulte a documentação**
   - [Manual do Desenvolvedor](./MANUAL-DESENVOLVEDOR.md)
   - [Manual do Usuário](./MANUAL-USUARIO.md)
   - [Guia de Deploy](./GUIA-DEPLOY.md)

3. **Abra uma issue**
   - Descreva o problema
   - Inclua logs e screenshots
   - Informe ambiente (OS, navegador, versão)

4. **Entre em contato**
   - Email: suporte@erplite.com.br
   - Horário: Seg a Sex, 8h às 18h

---

## 🔍 Comandos Úteis para Debug

```bash
# Frontend
npm run dev              # Modo desenvolvimento
npm run build            # Build de produção
npm run typecheck        # Verificar tipos

# Backend
npm run dev              # Modo desenvolvimento
npm run build            # Build
npm test                 # Testes

# Docker
docker-compose ps        # Status dos containers
docker-compose logs -f   # Logs em tempo real
docker-compose restart   # Reiniciar containers

# Banco de dados
npx prisma studio        # Visualizar dados
npx prisma db push       # Aplicar schema
npx prisma migrate dev   # Criar migração
```

---

**ERP Lite** - Troubleshooting Guide v1.0
