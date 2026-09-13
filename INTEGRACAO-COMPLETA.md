# 🔗 Guia de Integração - Frontend React + Backend Python

## 📋 Status da Integração

✅ **Frontend React** - Configurado para consumir API Python
✅ **Backend Python** - Rodando em http://localhost:8000
✅ **Autenticação JWT** - Implementada e funcional
✅ **API Client** - Configurado com interceptors
✅ **Environment** - Apontando para backend Python

---

## 🚀 Como Rodar Tudo Integrado

### 1. Iniciar Backend Python

```bash
cd backend-python
source venv/bin/activate  # ou .\venv\Scripts\activate no Windows
uvicorn app.main:app --reload --port 8000
```

**Verificar se está rodando:**
```bash
curl http://localhost:8000/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T14:30:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

### 2. Iniciar Frontend React

```bash
# Na raiz do projeto
npm run dev
```

**Acessar:** http://localhost:5173

### 3. Fazer Login

Use as credenciais do backend Python:

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | admin@erplite.com.br | admin123 |
| Gerente | gerente@erplite.com.br | gerente123 |
| Operador | operador@erplite.com.br | operador123 |

---

## 🔍 Verificando a Integração

### Teste 1: Health Check do Backend

```bash
curl http://localhost:8000/health
```

✅ Deve retornar status "ok"

### Teste 2: Login via API

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@erplite.com.br",
    "password": "admin123"
  }'
```

✅ Deve retornar token JWT e dados do usuário

### Teste 3: Listar Produtos (com autenticação)

```bash
# Primeiro, faça login e copie o accessToken
TOKEN="seu-token-aqui"

# Depois, liste os produtos
curl http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer $TOKEN"
```

✅ Deve retornar lista de produtos

### Teste 4: Frontend Conectado

1. Acesse http://localhost:5173
2. Faça login com admin@erplite.com.br / admin123
3. Verifique se o Dashboard carrega
4. Navegue pelos módulos

✅ Se tudo carregar, a integração está funcionando!

---

## 🛠️ Troubleshooting

### Problema: "Failed to fetch" ou "Network Error"

**Causa:** Backend não está rodando ou URL incorreta

**Solução:**
```bash
# Verificar se backend está rodando
curl http://localhost:8000/health

# Se não estiver, iniciar
cd backend-python
uvicorn app.main:app --reload --port 8000
```

### Problema: "CORS error"

**Causa:** Backend não permite requisições do frontend

**Solução:** Verificar `app/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Problema: "401 Unauthorized"

**Causa:** Token JWT inválido ou expirado

**Solução:**
1. Faça logout no frontend
2. Faça login novamente
3. Verifique se o token foi salvo no localStorage

### Problema: "Dados não carregam"

**Causa:** Frontend usando dados mock

**Solução:** Verificar `.env`:
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_USE_MOCK=false  # IMPORTANTE: deve ser false
```

Depois reinicie o frontend:
```bash
npm run dev
```

---

## 📊 Fluxo de Dados

```
┌─────────────────┐
│   Frontend      │
│   React         │
│   (porta 5173)  │
└────────┬────────┘
         │ HTTP/REST
         │ + JWT Token
         ▼
┌─────────────────┐
│   Backend       │
│   Python        │
│   FastAPI       │
│   (porta 8000)  │
└────────┬────────┘
         │ SQLAlchemy
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   (porta 5432)  │
└─────────────────┘
```

---

## 🔐 Autenticação

### Fluxo de Login

1. Frontend envia credenciais para `/api/v1/auth/login`
2. Backend valida e retorna JWT (access_token + refresh_token)
3. Frontend salva tokens no localStorage
4. Frontend adiciona token no header de todas as requisições
5. Backend valida token em cada requisição protegida

### Interceptor de Token

O `apiClient.ts` adiciona automaticamente o token:

```typescript
private getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (this.accessToken) {
    headers['Authorization'] = `Bearer ${this.accessToken}`;
  }
  return headers;
}
```

---

## 📡 Endpoints Disponíveis

### Autenticação
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Renovar token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Usuário atual

### Produtos
- `GET /api/v1/products` - Listar produtos
- `GET /api/v1/products/{id}` - Obter produto
- `POST /api/v1/products` - Criar produto
- `PUT /api/v1/products/{id}` - Atualizar produto
- `DELETE /api/v1/products/{id}` - Deletar produto

### Vendas
- `GET /api/v1/sales` - Listar vendas
- `GET /api/v1/sales/{id}` - Obter venda

### Estoque
- `GET /api/v1/stock` - Listar estoque
- `GET /api/v1/stock/movements` - Movimentações
- `POST /api/v1/stock/adjustment` - Ajustar estoque

### Clientes
- `GET /api/v1/customers` - Listar clientes
- `POST /api/v1/customers` - Criar cliente

### Fornecedores
- `GET /api/v1/suppliers` - Listar fornecedores
- `POST /api/v1/suppliers` - Criar fornecedor

### Integração PDV
- `POST /api/v1/pdv/auth` - Autenticar PDV
- `GET /api/v1/pdv/products` - Obter produtos
- `POST /api/v1/pdv/sales` - Enviar venda
- `PUT /api/v1/pdv/sales/cancel` - Cancelar venda

---

## ✅ Checklist de Integração

### Backend Python
- [ ] Servidor rodando em http://localhost:8000
- [ ] Health check funcionando
- [ ] Banco de dados conectado
- [ ] Dados iniciais populados (seed)
- [ ] CORS configurado para frontend

### Frontend React
- [ ] `.env` configurado com `VITE_API_URL=http://localhost:8000/api/v1`
- [ ] `.env` com `VITE_USE_MOCK=false`
- [ ] Servidor rodando em http://localhost:5173
- [ ] Consegue fazer login
- [ ] Consegue listar produtos
- [ ] Consegue navegar pelos módulos

### Integração
- [ ] Login funciona (frontend → backend)
- [ ] Token JWT é salvo no localStorage
- [ ] Token é enviado em todas as requisições
- [ ] Dados são carregados do backend
- [ ] CRUD de produtos funciona
- [ ] CRUD de clientes funciona
- [ ] CRUD de fornecedores funciona

---

## 🎯 Próximos Passos

### Implementados
- ✅ Backend Python completo
- ✅ Frontend React completo
- ✅ Autenticação JWT
- ✅ API Client configurado
- ✅ Environment configurado

### Para Testar
1. Iniciar backend Python
2. Iniciar frontend React
3. Fazer login
4. Testar todos os módulos
5. Verificar se dados são carregados do backend

### Para Produção
1. Configurar variáveis de ambiente de produção
2. Deploy do backend (Railway, Render, AWS)
3. Deploy do frontend (Vercel, Netlify)
4. Configurar HTTPS
5. Configurar banco de dados de produção

---

## 📞 Suporte

Se tiver problemas na integração:

1. **Verifique os logs**
   - Backend: terminal onde está rodando
   - Frontend: console do navegador (F12)

2. **Teste a API diretamente**
   - Use curl ou Postman
   - Verifique se os endpoints respondem

3. **Verifique as configurações**
   - `.env` do frontend
   - `app/main.py` do backend
   - CORS configurado corretamente

4. **Consulte a documentação**
   - Backend: http://localhost:8000/docs
   - Frontend: GUIA-USO.md

---

**ERP Lite** - Integração completa entre Frontend React e Backend Python! 🚀

**Status: PRONTO PARA USO** ✅
