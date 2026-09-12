"""
Exemplo Completo de PDV Python com ERP Lite
============================================

Este é um exemplo completo de como integrar um PDV Python com o ERP Lite.
Inclui operação online e offline, sincronização, e gestão de vendas.

Requisitos:
    pip install requests

Uso:
    python exemplo_pdv.py
"""

import sys
import time
from datetime import datetime
from erp_lite_client import (
    ERPLiteClient,
    Sale,
    SaleItem,
    Payment,
    OfflineQueue,
    AuthenticationError,
    ConnectionError,
    TimeoutError,
)


class PDV:
    """Sistema de PDV completo com integração ERP Lite"""
    
    def __init__(self, terminal_token: str, base_url: str = "http://localhost:3001/api/v1"):
        self.client = ERPLiteClient(
            base_url=base_url,
            terminal_token=terminal_token,
            timeout=5,
            max_retries=3,
        )
        self.queue = OfflineQueue("pdv_offline.db")
        self.products = []
        self.customers = []
        self.terminal_id = None
        self.operator_id = None
        self.is_authenticated = False
    
    def iniciar(self):
        """Inicia o PDV"""
        print("=" * 60)
        print("🖥️  PDV - ERP Lite")
        print("=" * 60)
        
        # 1. Autenticar
        self._autenticar()
        
        # 2. Sincronizar dados
        self._sincronizar()
        
        # 3. Processar fila offline
        self._processar_fila_offline()
        
        # 4. Menu principal
        self._menu_principal()
    
    def _autenticar(self):
        """Autentica o PDV no ERP"""
        print("\n🔐 Autenticando...")
        try:
            result = self.client.authenticate(pdv_version="2.5.1")
            if result.get("success"):
                self.terminal_id = result["data"]["terminal"]["id"]
                self.is_authenticated = True
                print(f"✅ Autenticado: {result['data']['terminal']['name']}")
            else:
                print("❌ Falha na autenticação")
                sys.exit(1)
        except Exception as e:
            print(f"❌ Erro na autenticação: {e}")
            sys.exit(1)
    
    def _sincronizar(self):
        """Sincroniza produtos e clientes"""
        print("\n🔄 Sincronizando dados...")
        
        # Verificar última sincronização
        last_sync = self.queue.get_last_sync()
        
        try:
            if last_sync:
                # Sincronização incremental
                print(f"   Última sync: {last_sync.strftime('%d/%m/%Y %H:%M')}")
                changes = self.client.get_product_changes(since=last_sync)
                updated = changes.get("data", {}).get("updated", [])
                deleted = changes.get("data", {}).get("deleted", [])
                print(f"   ✅ {len(updated)} produtos atualizados")
                print(f"   ✅ {len(deleted)} produtos removidos")
            else:
                # Primeira sincronização
                print("   Primeira sincronização...")
                self.products = self.client.get_all_products()
                print(f"   ✅ {len(self.products)} produtos sincronizados")
                
                self.customers = self.client.get_customers()
                print(f"   ✅ {len(self.customers)} clientes sincronizados")
            
            # Atualizar timestamp
            self.queue.set_last_sync(datetime.utcnow())
            
        except Exception as e:
            print(f"   ⚠️ Erro na sincronização: {e}")
            print("   Usando dados em cache...")
    
    def _processar_fila_offline(self):
        """Processa vendas pendentes da fila offline"""
        stats = self.queue.get_stats()
        pending = stats.get("pending", 0)
        
        if pending > 0:
            print(f"\n📤 Processando {pending} vendas pendentes...")
            
            for sale_data in self.queue.get_pending_sales():
                try:
                    # Recriar objeto Sale
                    sale = Sale(
                        terminal_id=sale_data["sale_data"]["terminalId"],
                        operator_id=sale_data["sale_data"]["operatorId"],
                        items=[SaleItem(**item) for item in sale_data["sale_data"]["items"]],
                        payments=[Payment(**p) for p in sale_data["sale_data"]["payments"]],
                    )
                    
                    self.client.send_sale(sale)
                    self.queue.mark_as_sent(sale_data["id"])
                    print(f"   ✅ Venda {sale_data['id'][:8]}... enviada")
                    
                except Exception as e:
                    self.queue.mark_as_error(sale_data["id"], str(e))
                    print(f"   ❌ Erro ao enviar venda: {e}")
    
    def _menu_principal(self):
        """Menu principal do PDV"""
        while True:
            print("\n" + "=" * 60)
            print("📋 MENU PRINCIPAL")
            print("=" * 60)
            print("1. Nova Venda")
            print("2. Listar Produtos")
            print("3. Listar Clientes")
            print("4. Sincronizar Dados")
            print("5. Ver Fila Offline")
            print("6. Health Check")
            print("0. Sair")
            print("=" * 60)
            
            opcao = input("\nOpção: ").strip()
            
            if opcao == "1":
                self._nova_venda()
            elif opcao == "2":
                self._listar_produtos()
            elif opcao == "3":
                self._listar_clientes()
            elif opcao == "4":
                self._sincronizar()
            elif opcao == "5":
                self._ver_fila_offline()
            elif opcao == "6":
                self._health_check()
            elif opcao == "0":
                print("\n👋 Encerrando PDV...")
                self.queue.close()
                break
            else:
                print("❌ Opção inválida")
    
    def _nova_venda(self):
        """Cria uma nova venda"""
        print("\n" + "=" * 60)
        print("🛒 NOVA VENDA")
        print("=" * 60)
        
        items = []
        total = 0.0
        
        while True:
            print("\n--- Item da Venda ---")
            product_code = input("Código do produto (ou 'f' para finalizar): ").strip()
            
            if product_code.lower() == 'f':
                break
            
            # Buscar produto
            product = next((p for p in self.products if p.get("code") == product_code), None)
            
            if not product:
                print("❌ Produto não encontrado")
                continue
            
            quantity = float(input("Quantidade: ").strip())
            unit_price = float(product.get("salePrice", 0))
            
            item = SaleItem(
                product_id=product["id"],
                barcode=product.get("barcode"),
                description=product["description"],
                quantity=quantity,
                unit_price=unit_price,
            )
            
            items.append(item)
            total += item.total
            
            print(f"✅ {item.description} - R$ {item.total:.2f}")
        
        if not items:
            print("❌ Venda cancelada (sem itens)")
            return
        
        # Pagamento
        print(f"\n💰 Total: R$ {total:.2f}")
        print("\nFormas de pagamento:")
        print("1. Dinheiro")
        print("2. PIX")
        print("3. Débito")
        print("4. Crédito")
        
        payment_type = input("\nOpção: ").strip()
        payment_map = {
            "1": "DINHEIRO",
            "2": "PIX",
            "3": "DEBITO",
            "4": "CREDITO",
        }
        
        payment = Payment(
            type=payment_map.get(payment_type, "DINHEIRO"),
            amount=total,
        )
        
        # Criar venda
        sale = Sale(
            terminal_id=self.terminal_id,
            operator_id=self.operator_id or "user-001",
            items=items,
            payments=[payment],
        )
        
        # Enviar venda
        print("\n📤 Enviando venda...")
        try:
            result = self.client.send_sale(sale)
            print(f"✅ Venda enviada com sucesso!")
            print(f"   ID: {result['data']['sale']['id']}")
            print(f"   Total: R$ {sale.total:.2f}")
        except Exception as e:
            print(f"❌ Erro ao enviar venda: {e}")
            print("💾 Salvando na fila offline...")
            self.queue.add_sale(sale)
            print("✅ Venda salva na fila offline")
    
    def _listar_produtos(self):
        """Lista produtos disponíveis"""
        print("\n" + "=" * 60)
        print("📦 PRODUTOS")
        print("=" * 60)
        
        if not self.products:
            print("Nenhum produto carregado")
            return
        
        print(f"\n{'Código':<10} {'Descrição':<30} {'Preço':<10} {'Estoque':<10}")
        print("-" * 60)
        
        for product in self.products[:20]:  # Mostrar apenas 20
            print(f"{product.get('code', ''):<10} {product.get('description', '')[:30]:<30} R$ {float(product.get('salePrice', 0)):<8.2f} {product.get('currentStock', 0):<10}")
        
        if len(self.products) > 20:
            print(f"\n... e mais {len(self.products) - 20} produtos")
    
    def _listar_clientes(self):
        """Lista clientes cadastrados"""
        print("\n" + "=" * 60)
        print("👥 CLIENTES")
        print("=" * 60)
        
        if not self.customers:
            print("Nenhum cliente carregado")
            return
        
        print(f"\n{'Nome':<30} {'Documento':<20} {'Telefone':<20}")
        print("-" * 70)
        
        for customer in self.customers[:20]:  # Mostrar apenas 20
            print(f"{customer.get('name', ''):<30} {customer.get('document', ''):<20} {customer.get('phone', ''):<20}")
        
        if len(self.customers) > 20:
            print(f"\n... e mais {len(self.customers) - 20} clientes")
    
    def _ver_fila_offline(self):
        """Mostra estatísticas da fila offline"""
        print("\n" + "=" * 60)
        print("📊 FILA OFFLINE")
        print("=" * 60)
        
        stats = self.queue.get_stats()
        
        print(f"\nPendentes: {stats.get('pending', 0)}")
        print(f"Enviadas:  {stats.get('sent', 0)}")
        print(f"Erros:     {stats.get('error', 0)}")
        print(f"Total:     {stats.get('total', 0)}")
        
        last_sync = self.queue.get_last_sync()
        if last_sync:
            print(f"\nÚltima sync: {last_sync.strftime('%d/%m/%Y %H:%M')}")
    
    def _health_check(self):
        """Verifica se o ERP está online"""
        print("\n🔍 Verificando conexão...")
        
        if self.client.health_check():
            print("✅ ERP está online")
        else:
            print("❌ ERP está offline")


# ============================================
# EXECUÇÃO
# ============================================

if __name__ == "__main__":
    # Configuração
    TERMINAL_TOKEN = "pdv-token-001"  # Token do terminal (configurar no ERP)
    BASE_URL = "http://localhost:3001/api/v1"
    
    # Criar e iniciar PDV
    pdv = PDV(terminal_token=TERMINAL_TOKEN, base_url=BASE_URL)
    
    try:
        pdv.iniciar()
    except KeyboardInterrupt:
        print("\n\n⚠️ Interrupção pelo usuário")
        pdv.queue.close()
    except Exception as e:
        print(f"\n❌ Erro fatal: {e}")
        pdv.queue.close()
        sys.exit(1)
