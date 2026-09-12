# ERP Lite - SDK Python para PDV

SDK oficial para integração do PDV Python com o ERP Lite.

## 📦 Instalação

```bash
pip install requests
```

## 🚀 Quick Start

```python
from erp_lite_client import ERPLiteClient, Sale, SaleItem, Payment

# 1. Criar cliente
client = ERPLiteClient(
    base_url="http://localhost:3001/api/v1",
    terminal_token="seu-token-aqui"
)

# 2. Autenticar
client.authenticate(pdv_version="2.5.1")

# 3. Sincronizar produtos
products = client.get_all_products()
print(f"{len(products)} produtos sincronizados")

# 4. Criar venda
sale = Sale(
    terminal_id="terminal-001",
    operator_id="user-001",
    items=[
        SaleItem(
            product_id="prod-001",
            barcode="7891000100103",
            description="Arroz Camil 5kg",
            quantity=2,
            unit_price=24.90,
        ),
    ],
    payments=[
        Payment(type="PIX", amount=49.80),
    ],
)

# 5. Enviar venda
result = client.send_sale(sale)
print(f"Venda enviada: {result}")
```

## 📚 Documentação Completa

### Autenticação

```python
# Autenticar PDV
client.authenticate(pdv_version="2.5.1")

# Verificar se está autenticado
if client.is_authenticated():
    print("✅ Autenticado")
```

### Produtos

```python
# Obter todos os produtos
products = client.get_all_products()

# Obter produtos paginados
response = client.get_products(cursor=None, limit=100)
products = response['data']['items']

# Obter alterações desde uma data
from datetime import datetime
changes = client.get_product_changes(since=datetime(2026, 1, 1))
updated = changes['data']['updated']
deleted = changes['data']['deleted']
```

### Clientes

```python
# Obter todos os clientes
customers = client.get_customers()
```

### Vendas

```python
# Criar venda
sale = Sale(
    terminal_id="terminal-001",
    operator_id="user-001",
    customer_id="customer-001",  # Opcional
    items=[
        SaleItem(
            product_id="prod-001",
            barcode="7891000100103",
            description="Arroz Camil 5kg",
            quantity=2,
            unit_price=24.90,
            discount=0.0,
            is_weighable=False,
        ),
    ],
    payments=[
        Payment(type="PIX", amount=49.80),
    ],
    discount=0.0,
)

# Enviar venda (IDEMPOTENTE)
result = client.send_sale(sale)

# Cancelar venda
client.cancel_sale(sale_id="uuid-da-venda", reason="Erro de digitação")
```

### Sincronização

```python
# Sincronização completa
result = client.full_sync()

# Sincronização incremental
from datetime import datetime
last_sync = datetime(2026, 1, 15, 10, 0, 0)
result = client.full_sync(last_sync_at=last_sync)
```

### Operação Offline

```python
from erp_lite_client import OfflineQueue

# Criar fila offline
queue = OfflineQueue("offline_queue.db")

# Adicionar venda à fila (quando offline)
queue.add_sale(sale)

# Verificar vendas pendentes
pending = queue.get_pending_sales()
print(f"{len(pending)} vendas pendentes")

# Processar fila quando online
for sale_data in pending:
    try:
        client.send_sale(sale_data['sale'])
        queue.mark_as_sent(sale_data['id'])
    except Exception as e:
        queue.mark_as_error(sale_data['id'], str(e))

# Estatísticas da fila
stats = queue.get_stats()
print(f"Fila: {stats}")
```

### Health Check

```python
# Verificar se ERP está online
if client.health_check():
    print("✅ ERP online")
else:
    print("❌ ERP offline")
```

## 🔧 Configuração Avançada

```python
client = ERPLiteClient(
    base_url="https://api.erplite.com.br/v1",
    terminal_token="seu-token-aqui",
    timeout=10,          # Timeout em segundos
    max_retries=5,       # Máximo de tentativas
)
```

## 📊 Estrutura de Dados

### Sale

```python
Sale(
    terminal_id: str,
    operator_id: str,
    items: List[SaleItem],
    payments: List[Payment],
    customer_id: Optional[str] = None,
    date: Optional[str] = None,  # ISO 8601
    discount: float = 0.0,
)
```

### SaleItem

```python
SaleItem(
    product_id: str,
    barcode: Optional[str],
    description: str,
    quantity: float,
    unit_price: float,
    discount: float = 0.0,
    total: float = 0.0,  # Calculado automaticamente
    is_weighable: bool = False,
    weight: Optional[float] = None,
)
```

### Payment

```python
Payment(
    type: str,  # DINHEIRO, PIX, DEBITO, CREDITO, VALE, OUTROS
    amount: float,
    reference: Optional[str] = None,  # NSU, autorização, etc
)
```

## 🚨 Tratamento de Erros

```python
from erp_lite_client import (
    ERPLiteError,
    AuthenticationError,
    APIError,
    TimeoutError,
    ConnectionError,
)

try:
    client.send_sale(sale)
except AuthenticationError:
    print("❌ Token inválido. Reautenticar.")
    client.authenticate(pdv_version="2.5.1")
except TimeoutError:
    print("⏱️ Timeout. Tentar novamente.")
except ConnectionError:
    print("🔌 Sem conexão. Usar fila offline.")
    queue.add_sale(sale)
except APIError as e:
    print(f"❌ Erro da API: {e}")
except ERPLiteError as e:
    print(f"❌ Erro: {e}")
```

## 📝 Exemplo Completo: PDV com Operação Offline

```python
from erp_lite_client import ERPLiteClient, Sale, SaleItem, Payment, OfflineQueue
from datetime import datetime

# Inicializar
client = ERPLiteClient(
    base_url="http://localhost:3001/api/v1",
    terminal_token="pdv-token-001",
)
queue = OfflineQueue("offline_queue.db")

# Autenticar
try:
    client.authenticate(pdv_version="2.5.1")
    print("✅ Autenticado")
except Exception as e:
    print(f"❌ Erro na autenticação: {e}")
    exit(1)

# Sincronizar produtos
try:
    last_sync = queue.get_last_sync()
    if last_sync:
        changes = client.get_product_changes(since=last_sync)
        print(f"✅ {len(changes['data']['updated'])} produtos atualizados")
    else:
        products = client.get_all_products()
        print(f"✅ {len(products)} produtos sincronizados")
    
    queue.set_last_sync(datetime.utcnow())
except Exception as e:
    print(f"⚠️ Erro na sincronização: {e}")

# Processar vendas pendentes
try:
    pending = queue.get_pending_sales()
    for sale_data in pending:
        try:
            client.send_sale(sale_data['sale'])
            queue.mark_as_sent(sale_data['id'])
            print(f"✅ Venda {sale_data['id']} enviada")
        except Exception as e:
            queue.mark_as_error(sale_data['id'], str(e))
            print(f"❌ Erro ao enviar venda: {e}")
except Exception as e:
    print(f"⚠️ Erro ao processar fila: {e}")

# Simular venda
sale = Sale(
    terminal_id="terminal-001",
    operator_id="user-001",
    items=[
        SaleItem(
            product_id="prod-001",
            barcode="7891000100103",
            description="Arroz Camil 5kg",
            quantity=2,
            unit_price=24.90,
        ),
    ],
    payments=[
        Payment(type="PIX", amount=49.80),
    ],
)

# Enviar venda
try:
    result = client.send_sale(sale)
    print(f"✅ Venda enviada: {result['data']['sale']['id']}")
except Exception as e:
    print(f"❌ Erro ao enviar venda: {e}")
    queue.add_sale(sale)
    print("💾 Venda salva na fila offline")

# Estatísticas
stats = queue.get_stats()
print(f"\n📊 Fila offline: {stats}")

# Fechar
queue.close()
```

## 🔒 Segurança

- ✅ Tokens JWT em todas as requisições
- ✅ HTTPS obrigatório em produção
- ✅ Validação de dados
- ✅ Idempotência garantida

## 📞 Suporte

- Email: suporte@erplite.com.br
- Documentação: [INTEGRACAO.md](../INTEGRACAO.md)

---

**ERP Lite SDK** - Integração simplificada com PDV Python
