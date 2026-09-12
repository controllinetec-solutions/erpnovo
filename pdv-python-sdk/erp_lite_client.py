"""
ERP Lite - SDK Python para Integração com PDV
==============================================

Biblioteca oficial para integrar o PDV Python com o ERP Lite.

Instalação:
    pip install requests

Uso:
    from erp_lite_client import ERPLiteClient
    
    client = ERPLiteClient(
        base_url="https://api.erplite.com.br/v1",
        terminal_token="seu-token-aqui"
    )
    
    # Autenticar
    client.authenticate(pdv_version="2.5.1")
    
    # Sincronizar produtos
    products = client.sync_products()
    
    # Enviar venda
    client.send_sale(sale_data)
"""

import requests
import uuid
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, asdict


@dataclass
class SaleItem:
    product_id: str
    barcode: Optional[str]
    description: str
    quantity: float
    unit_price: float
    discount: float = 0.0
    total: float = 0.0
    is_weighable: bool = False
    weight: Optional[float] = None
    
    def __post_init__(self):
        if self.total == 0:
            self.total = (self.quantity * self.unit_price) - self.discount


@dataclass
class Payment:
    type: str  # DINHEIRO, PIX, DEBITO, CREDITO, VALE, OUTROS
    amount: float
    reference: Optional[str] = None


@dataclass
class Sale:
    terminal_id: str
    operator_id: str
    items: List[SaleItem]
    payments: List[Payment]
    customer_id: Optional[str] = None
    date: Optional[str] = None
    discount: float = 0.0
    
    def __post_init__(self):
        if self.date is None:
            self.date = datetime.utcnow().isoformat() + "Z"
    
    @property
    def subtotal(self) -> float:
        return sum(item.total for item in self.items)
    
    @property
    def total(self) -> float:
        return self.subtotal - self.discount
    
    def to_dict(self) -> Dict[str, Any]:
        sale_id = str(uuid.uuid4())
        return {
            "saleId": sale_id,
            "terminalId": self.terminal_id,
            "operatorId": self.operator_id,
            "customerId": self.customer_id,
            "date": self.date,
            "items": [asdict(item) for item in self.items],
            "payments": [asdict(p) for p in self.payments],
            "subtotal": self.subtotal,
            "discount": self.discount,
            "total": self.total,
            "idempotencyKey": sale_id,
        }


class ERPLiteClient:
    """Cliente Python para integração com ERP Lite"""
    
    def __init__(
        self,
        base_url: str,
        terminal_token: str,
        timeout: int = 5,
        max_retries: int = 3,
    ):
        self.base_url = base_url.rstrip("/")
        self.terminal_token = terminal_token
        self.timeout = timeout
        self.max_retries = max_retries
        self.jwt_token: Optional[str] = None
        self.terminal_info: Optional[Dict] = None
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "User-Agent": "ERP-Lite-PDV-SDK/1.0.0",
        })
    
    def _request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict] = None,
        params: Optional[Dict] = None,
        requires_auth: bool = True,
    ) -> Dict[str, Any]:
        """Faz requisição HTTP com retry automático"""
        url = f"{self.base_url}{endpoint}"
        
        headers = {}
        if requires_auth and self.jwt_token:
            headers["Authorization"] = f"Bearer {self.jwt_token}"
        
        last_error = None
        for attempt in range(self.max_retries):
            try:
                response = self.session.request(
                    method=method,
                    url=url,
                    json=data,
                    params=params,
                    headers=headers,
                    timeout=self.timeout,
                )
                
                if response.status_code == 401:
                    raise AuthenticationError("Token inválido ou expirado")
                
                response.raise_for_status()
                return response.json()
                
            except requests.exceptions.Timeout:
                last_error = TimeoutError(f"Timeout na tentativa {attempt + 1}")
                if attempt < self.max_retries - 1:
                    continue
            except requests.exceptions.ConnectionError:
                last_error = ConnectionError("Sem conexão com o servidor")
                if attempt < self.max_retries - 1:
                    continue
            except requests.exceptions.HTTPError as e:
                last_error = APIError(f"Erro HTTP: {e}")
                break
        
        raise last_error
    
    # ============================================
    # AUTENTICAÇÃO
    # ============================================
    
    def authenticate(self, pdv_version: str) -> Dict:
        """Autentica o PDV no ERP"""
        response = self._request(
            "POST",
            "/pdv/auth",
            data={
                "terminalToken": self.terminal_token,
                "pdvVersion": pdv_version,
            },
            requires_auth=False,
        )
        
        if response.get("success"):
            self.jwt_token = response["data"]["token"]
            self.terminal_info = response["data"]["terminal"]
        
        return response
    
    def is_authenticated(self) -> bool:
        """Verifica se está autenticado"""
        return self.jwt_token is not None
    
    # ============================================
    # PRODUTOS
    # ============================================
    
    def get_products(self, cursor: Optional[str] = None, limit: int = 100) -> Dict:
        """Obtém lista de produtos (paginado)"""
        params = {"limit": limit}
        if cursor:
            params["cursor"] = cursor
        
        return self._request("GET", "/pdv/products", params=params)
    
    def get_all_products(self) -> List[Dict]:
        """Obtém TODOS os produtos (pagina automaticamente)"""
        all_products = []
        cursor = None
        
        while True:
            response = self.get_products(cursor=cursor)
            data = response.get("data", {})
            all_products.extend(data.get("items", []))
            
            if not data.get("hasMore"):
                break
            cursor = data.get("cursor")
        
        return all_products
    
    def get_product_changes(self, since: datetime) -> Dict:
        """Obtém alterações de produtos desde uma data"""
        return self._request(
            "GET",
            "/pdv/products/changes",
            params={"since": since.isoformat() + "Z"},
        )
    
    # ============================================
    # CLIENTES
    # ============================================
    
    def get_customers(self) -> List[Dict]:
        """Obtém lista de clientes"""
        response = self._request("GET", "/pdv/customers")
        return response.get("data", {}).get("items", [])
    
    # ============================================
    # VENDAS
    # ============================================
    
    def send_sale(self, sale: Sale) -> Dict:
        """
        Envia venda para o ERP (IDEMPOTENTE)
        
        Se a venda já foi enviada (mesmo saleId), retorna a existente.
        """
        return self._request("POST", "/pdv/sales", data=sale.to_dict())
    
    def cancel_sale(self, sale_id: str, reason: str = "") -> Dict:
        """Cancela uma venda e estorna estoque"""
        return self._request(
            "PUT",
            "/pdv/sales/cancel",
            data={"saleId": sale_id, "reason": reason},
        )
    
    # ============================================
    # SINCRONIZAÇÃO
    # ============================================
    
    def full_sync(self, last_sync_at: Optional[datetime] = None) -> Dict:
        """Sincronização completa com o ERP"""
        data = {}
        if last_sync_at:
            data["lastSyncAt"] = last_sync_at.isoformat() + "Z"
        
        return self._request("POST", "/pdv/sync", data=data)
    
    # ============================================
    # UTILITÁRIOS
    # ============================================
    
    def health_check(self) -> bool:
        """Verifica se o ERP está online"""
        try:
            response = self.session.get(
                f"{self.base_url}/../health",
                timeout=self.timeout,
            )
            return response.status_code == 200
        except Exception:
            return False


# ============================================
# EXCEÇÕES
# ============================================

class ERPLiteError(Exception):
    """Erro base do SDK"""
    pass


class AuthenticationError(ERPLiteError):
    """Erro de autenticação"""
    pass


class APIError(ERPLiteError):
    """Erro da API"""
    pass


class TimeoutError(ERPLiteError):
    """Timeout na requisição"""
    pass


class ConnectionError(ERPLiteError):
    """Erro de conexão"""
    pass


# ============================================
# FILA DE SINCRONIZAÇÃO OFFLINE
# ============================================

class OfflineQueue:
    """
    Fila de sincronização para operação offline.
    
    Quando a internet está indisponível, as vendas são salvas
    localmente e enviadas automaticamente quando a conexão retornar.
    """
    
    def __init__(self, db_path: str = "offline_queue.db"):
        import sqlite3
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        self._init_db()
    
    def _init_db(self):
        """Inicializa banco SQLite local"""
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS sales_queue (
                id TEXT PRIMARY KEY,
                sale_data TEXT NOT NULL,
                created_at TEXT NOT NULL,
                attempts INTEGER DEFAULT 0,
                last_attempt TEXT,
                status TEXT DEFAULT 'pending',
                error_message TEXT
            )
        """)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS sync_metadata (
                key TEXT PRIMARY KEY,
                value TEXT
            )
        """)
        self.conn.commit()
    
    def add_sale(self, sale: Sale) -> str:
        """Adiciona venda à fila"""
        sale_id = str(uuid.uuid4())
        self.conn.execute(
            """
            INSERT INTO sales_queue (id, sale_data, created_at, status)
            VALUES (?, ?, ?, 'pending')
            """,
            (sale_id, json.dumps(sale.to_dict()), datetime.utcnow().isoformat()),
        )
        self.conn.commit()
        return sale_id
    
    def get_pending_sales(self) -> List[Dict]:
        """Obtém vendas pendentes"""
        cursor = self.conn.execute(
            """
            SELECT id, sale_data FROM sales_queue
            WHERE status = 'pending' AND attempts < 5
            ORDER BY created_at ASC
            """
        )
        return [
            {"id": row[0], "sale_data": json.loads(row[1])}
            for row in cursor.fetchall()
        ]
    
    def mark_as_sent(self, sale_id: str):
        """Marca venda como enviada"""
        self.conn.execute(
            "UPDATE sales_queue SET status = 'sent', last_attempt = ? WHERE id = ?",
            (datetime.utcnow().isoformat(), sale_id),
        )
        self.conn.commit()
    
    def mark_as_error(self, sale_id: str, error: str):
        """Marca venda com erro"""
        self.conn.execute(
            """
            UPDATE sales_queue
            SET status = 'error', attempts = attempts + 1,
                last_attempt = ?, error_message = ?
            WHERE id = ?
            """,
            (datetime.utcnow().isoformat(), error, sale_id),
        )
        self.conn.commit()
    
    def get_last_sync(self) -> Optional[datetime]:
        """Obtém data do último sync"""
        cursor = self.conn.execute(
            "SELECT value FROM sync_metadata WHERE key = 'last_sync'"
        )
        row = cursor.fetchone()
        if row:
            return datetime.fromisoformat(row[0])
        return None
    
    def set_last_sync(self, dt: datetime):
        """Define data do último sync"""
        self.conn.execute(
            """
            INSERT OR REPLACE INTO sync_metadata (key, value)
            VALUES ('last_sync', ?)
            """,
            (dt.isoformat(),),
        )
        self.conn.commit()
    
    def get_stats(self) -> Dict:
        """Estatísticas da fila"""
        cursor = self.conn.execute(
            """
            SELECT status, COUNT(*) FROM sales_queue
            GROUP BY status
            """
        )
        stats = {row[0]: row[1] for row in cursor.fetchall()}
        return {
            "pending": stats.get("pending", 0),
            "sent": stats.get("sent", 0),
            "error": stats.get("error", 0),
            "total": sum(stats.values()),
        }
    
    def close(self):
        """Fecha conexão"""
        self.conn.close()


# ============================================
# EXEMPLO DE USO
# ============================================

if __name__ == "__main__":
    # Exemplo de uso do SDK
    print("ERP Lite - SDK Python para PDV")
    print("=" * 50)
    
    # 1. Criar cliente
    client = ERPLiteClient(
        base_url="http://localhost:3001/api/v1",
        terminal_token="pdv-token-001",
    )
    
    # 2. Autenticar
    try:
        auth_result = client.authenticate(pdv_version="2.5.1")
        print(f"✅ Autenticado: {client.terminal_info}")
    except Exception as e:
        print(f"❌ Erro na autenticação: {e}")
        exit(1)
    
    # 3. Sincronizar produtos
    try:
        products = client.get_all_products()
        print(f"✅ {len(products)} produtos sincronizados")
    except Exception as e:
        print(f"❌ Erro ao sincronizar produtos: {e}")
    
    # 4. Criar fila offline
    queue = OfflineQueue("offline_queue.db")
    print(f"✅ Fila offline inicializada")
    
    # 5. Exemplo de venda
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
    
    print(f"\n📦 Venda criada:")
    print(f"   Total: R$ {sale.total:.2f}")
    print(f"   Itens: {len(sale.items)}")
    print(f"   Pagamentos: {len(sale.payments)}")
    
    # 6. Enviar venda
    try:
        result = client.send_sale(sale)
        print(f"✅ Venda enviada: {result.get('data', {}).get('sale', {}).get('id')}")
    except Exception as e:
        print(f"❌ Erro ao enviar venda: {e}")
        # Adicionar à fila offline
        queue.add_sale(sale)
        print(f"💾 Venda salva na fila offline")
    
    # 7. Estatísticas da fila
    stats = queue.get_stats()
    print(f"\n📊 Fila offline: {stats}")
    
    queue.close()
    print("\n✅ Exemplo concluído!")
