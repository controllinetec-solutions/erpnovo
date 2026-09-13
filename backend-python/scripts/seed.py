"""
ERP Lite - Script de Seed (Dados Iniciais)
"""

import asyncio
import sys
import os

# Adicionar o diretório raiz ao path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal, engine, Base
from app.models.user import User
from app.models.company import Company, Store
from app.models.product import Product, Category, Brand
from app.models.terminal import Terminal
from app.core.security import get_password_hash
import uuid


async def seed():
    """Popular banco de dados com dados iniciais"""
    
    print("🌱 Iniciando seed do banco de dados...")
    
    # Criar tabelas
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Tabelas criadas")
    
    async with AsyncSessionLocal() as session:
        # ============================================
        # EMPRESA
        # ============================================
        company = Company(
            id="company-001",
            name="Mercado Silva Ltda",
            trade_name="Mercado Silva",
            document="12.345.678/0001-90",
            state_registration="001.234.567.890",
            address="Rua das Flores, 123 - Centro",
            city="Belo Horizonte",
            state="MG",
            zip_code="30130-000",
            phone="(31) 3333-1234",
            email="contato@mercadosilva.com.br",
            segment="mercado",
            active=True
        )
        session.add(company)
        print("✅ Empresa criada")
        
        # ============================================
        # LOJAS
        # ============================================
        store1 = Store(
            id="store-001",
            company_id=company.id,
            name="Loja 01 - Centro",
            code="001",
            address="Rua das Flores, 123 - Centro",
            city="Belo Horizonte",
            state="MG",
            zip_code="30130-000",
            phone="(31) 3333-1234",
            active=True
        )
        
        store2 = Store(
            id="store-002",
            company_id=company.id,
            name="Loja 02 - Bairro Norte",
            code="002",
            address="Av. Brasil, 456 - Bairro Norte",
            city="Belo Horizonte",
            state="MG",
            zip_code="30140-000",
            phone="(31) 3333-5678",
            active=True
        )
        
        session.add(store1)
        session.add(store2)
        print("✅ Lojas criadas")
        
        # ============================================
        # USUÁRIOS
        # ============================================
        admin = User(
            id="user-admin",
            company_id=company.id,
            store_id=store1.id,
            name="Admin Master",
            email="admin@erplite.com.br",
            password_hash=get_password_hash("admin123"),
            role="ADMIN",
            permissions=[
                "products.view", "products.create", "products.edit", "products.delete",
                "stock.view", "stock.adjust",
                "sales.view", "sales.cancel",
                "finance.view", "finance.manage",
                "customers.view", "customers.create", "customers.edit",
                "suppliers.view", "suppliers.create",
                "reports.view",
                "settings.manage",
                "users.manage",
                "pdv.monitor"
            ],
            active=True
        )
        
        manager = User(
            id="user-manager",
            company_id=company.id,
            store_id=store1.id,
            name="Maria Silva",
            email="gerente@erplite.com.br",
            password_hash=get_password_hash("gerente123"),
            role="MANAGER",
            permissions=[
                "products.view", "products.create", "products.edit",
                "stock.view", "stock.adjust",
                "sales.view", "sales.cancel",
                "finance.view",
                "customers.view", "customers.create", "customers.edit",
                "suppliers.view",
                "reports.view",
                "pdv.monitor"
            ],
            active=True
        )
        
        operator = User(
            id="user-operator",
            company_id=company.id,
            store_id=store1.id,
            name="Carlos Oliveira",
            email="operador@erplite.com.br",
            password_hash=get_password_hash("operador123"),
            role="OPERATOR",
            permissions=[
                "products.view",
                "stock.view",
                "sales.view",
                "customers.view"
            ],
            active=True
        )
        
        session.add(admin)
        session.add(manager)
        session.add(operator)
        print("✅ Usuários criados")
        
        # ============================================
        # CATEGORIAS
        # ============================================
        categories = [
            Category(id="cat-mercearia", name="Mercearia"),
            Category(id="cat-hortifruti", name="Hortifrúti"),
            Category(id="cat-padaria", name="Padaria"),
            Category(id="cat-bebidas", name="Bebidas"),
            Category(id="cat-laticinios", name="Laticínios"),
            Category(id="cat-higiene", name="Higiene"),
            Category(id="cat-limpeza", name="Limpeza"),
        ]
        
        for cat in categories:
            session.add(cat)
        print(f"✅ {len(categories)} categorias criadas")
        
        # ============================================
        # PRODUTOS
        # ============================================
        products = [
            Product(
                id="prod-001",
                store_id=store1.id,
                code="001",
                barcode="7891000100103",
                description="Arroz Tipo 1 Camil 5kg",
                short_description="Arroz Camil 5kg",
                category_id="cat-mercearia",
                unit="UN",
                ncm="10063021",
                cost_price=18.50,
                sale_price=24.90,
                margin=25.7,
                min_stock=20,
                is_weighable=False,
                status="ACTIVE"
            ),
            Product(
                id="prod-002",
                store_id=store1.id,
                code="002",
                barcode="7891000200209",
                description="Feijão Carioca Kicaldo 1kg",
                short_description="Feijão Kicaldo 1kg",
                category_id="cat-mercearia",
                unit="UN",
                ncm="07133319",
                cost_price=6.80,
                sale_price=9.90,
                margin=31.3,
                min_stock=30,
                is_weighable=False,
                status="ACTIVE"
            ),
            Product(
                id="prod-003",
                store_id=store1.id,
                code="003",
                barcode="2000001000000",
                description="Banana Prata kg",
                short_description="Banana Prata",
                category_id="cat-hortifruti",
                unit="KG",
                ncm="08030000",
                cost_price=3.20,
                sale_price=5.99,
                margin=46.6,
                min_stock=10,
                is_weighable=True,
                status="ACTIVE"
            ),
        ]
        
        for prod in products:
            session.add(prod)
        print(f"✅ {len(products)} produtos criados")
        
        # ============================================
        # TERMINAIS PDV
        # ============================================
        terminals = [
            Terminal(
                id="terminal-001",
                store_id=store1.id,
                name="PDV 01",
                token="pdv-token-001",
                status="OFFLINE"
            ),
            Terminal(
                id="terminal-002",
                store_id=store1.id,
                name="PDV 02",
                token="pdv-token-002",
                status="OFFLINE"
            ),
            Terminal(
                id="terminal-003",
                store_id=store1.id,
                name="PDV 03",
                token="pdv-token-003",
                status="OFFLINE"
            ),
        ]
        
        for term in terminals:
            session.add(term)
        print(f"✅ {len(terminals)} terminais criados")
        
        # Commit
        await session.commit()
    
    print("\n🎉 Seed concluído com sucesso!")
    print("\n📋 Credenciais de acesso:")
    print("   Admin: admin@erplite.com.br / admin123")
    print("   Gerente: gerente@erplite.com.br / gerente123")
    print("   Operador: operador@erplite.com.br / operador123")


if __name__ == "__main__":
    asyncio.run(seed())
