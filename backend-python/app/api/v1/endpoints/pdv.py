"""
ERP Lite - PDV Integration Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from datetime import datetime
import uuid

from app.core.database import get_db
from app.models.product import Product
from app.models.customer import Customer
from app.models.sale import Sale, SaleItem, SalePayment
from app.models.terminal import Terminal
from app.models.stock import StockItem, StockMovement
from app.schemas.sale import SaleCreate

router = APIRouter()


@router.post("/auth")
async def authenticate_pdv(
    terminal_token: str,
    pdv_version: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Autenticar PDV
    """
    result = await db.execute(
        select(Terminal).where(Terminal.token == terminal_token)
    )
    terminal = result.scalar_one_or_none()
    
    if not terminal:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Terminal não encontrado"
        )
    
    # Atualizar versão e status
    terminal.pdv_version = pdv_version
    terminal.status = "ONLINE"
    terminal.last_access = datetime.utcnow()
    
    await db.commit()
    
    return {
        "success": True,
        "data": {
            "token": terminal_token,
            "terminal": {
                "id": terminal.id,
                "name": terminal.name,
                "storeId": terminal.store_id
            }
        }
    }


@router.get("/products")
async def get_products_for_pdv(
    cursor: Optional[str] = None,
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db)
):
    """
    Obter produtos para PDV (paginado)
    """
    query = select(Product).where(
        Product.status == "ACTIVE",
        Product.deleted_at.is_(None)
    )
    
    if cursor:
        query = query.where(Product.id > cursor)
    
    query = query.order_by(Product.id).limit(limit)
    
    result = await db.execute(query)
    products = result.scalars().all()
    
    next_cursor = products[-1].id if len(products) == limit else None
    
    return {
        "success": True,
        "data": {
            "items": [
                {
                    "id": p.id,
                    "code": p.code,
                    "barcode": p.barcode,
                    "description": p.description,
                    "salePrice": str(p.sale_price),
                    "unit": p.unit,
                    "isWeighable": p.is_weighable
                }
                for p in products
            ],
            "cursor": next_cursor,
            "hasMore": next_cursor is not None,
            "serverTime": datetime.utcnow().isoformat()
        }
    }


@router.get("/products/changes")
async def get_product_changes(
    since: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Obter alterações de produtos desde uma data
    """
    since_date = datetime.fromisoformat(since.replace('Z', '+00:00'))
    
    # Produtos atualizados
    updated_query = select(Product).where(
        Product.updated_at > since_date,
        Product.deleted_at.is_(None)
    )
    updated_result = await db.execute(updated_query)
    updated = updated_result.scalars().all()
    
    # Produtos deletados
    deleted_query = select(Product).where(
        Product.deleted_at > since_date
    )
    deleted_result = await db.execute(deleted_query)
    deleted = deleted_result.scalars().all()
    
    return {
        "success": True,
        "data": {
            "updated": [
                {
                    "id": p.id,
                    "code": p.code,
                    "barcode": p.barcode,
                    "description": p.description,
                    "salePrice": str(p.sale_price),
                    "unit": p.unit,
                    "isWeighable": p.is_weighable
                }
                for p in updated
            ],
            "deleted": [p.id for p in deleted],
            "serverTime": datetime.utcnow().isoformat()
        }
    }


@router.get("/customers")
async def get_customers_for_pdv(
    db: AsyncSession = Depends(get_db)
):
    """
    Obter clientes para PDV
    """
    result = await db.execute(
        select(Customer).where(Customer.active == True)
    )
    customers = result.scalars().all()
    
    return {
        "success": True,
        "data": {
            "items": [
                {
                    "id": c.id,
                    "name": c.name,
                    "document": c.document,
                    "phone": c.phone
                }
                for c in customers
            ],
            "serverTime": datetime.utcnow().isoformat()
        }
    }


@router.post("/sales", status_code=status.HTTP_201_CREATED)
async def send_sale(
    sale_data: SaleCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Enviar venda do PDV (IDEMPOTENTE)
    """
    # Verificar idempotência
    existing = await db.execute(
        select(Sale).where(Sale.sale_id == sale_data.sale_id)
    )
    existing_sale = existing.scalar_one_or_none()
    
    if existing_sale:
        return {
            "success": True,
            "data": {
                "sale": {
                    "id": existing_sale.id,
                    "saleId": existing_sale.sale_id
                },
                "duplicated": True,
                "message": "Venda já registrada (idempotente)"
            }
        }
    
    # Criar venda
    sale = Sale(
        id=str(uuid.uuid4()),
        sale_id=sale_data.sale_id,
        store_id="store-001",  # TODO: obter do terminal autenticado
        terminal_id=sale_data.terminal_id,
        operator_id=sale_data.operator_id,
        customer_id=sale_data.customer_id,
        date=sale_data.date,
        subtotal=sale_data.subtotal,
        discount=sale_data.discount,
        total=sale_data.total,
        status="COMPLETED",
        synced=True,
        sync_date=datetime.utcnow()
    )
    
    db.add(sale)
    await db.flush()
    
    # Criar itens
    for item_data in sale_data.items:
        item = SaleItem(
            id=str(uuid.uuid4()),
            sale_id=sale.id,
            product_id=item_data.product_id,
            description=item_data.description,
            barcode=item_data.barcode,
            quantity=item_data.quantity,
            unit_price=item_data.unit_price,
            discount=item_data.discount,
            total=item_data.total,
            is_weighable=item_data.is_weighable,
            weight=item_data.weight
        )
        db.add(item)
        
        # Atualizar estoque
        stock_result = await db.execute(
            select(StockItem).where(
                StockItem.store_id == sale.store_id,
                StockItem.product_id == item_data.product_id
            )
        )
        stock_item = stock_result.scalar_one_or_none()
        
        if stock_item:
            previous_qty = stock_item.quantity
            stock_item.quantity -= item_data.quantity
            
            # Registrar movimentação
            movement = StockMovement(
                id=str(uuid.uuid4()),
                stock_item_id=stock_item.id,
                type="EXIT_SALE",
                quantity=item_data.quantity,
                previous_qty=previous_qty,
                new_qty=stock_item.quantity,
                origin=f"Venda {sale_data.sale_id}",
                reference_id=sale.id,
                created_at=datetime.utcnow()
            )
            db.add(movement)
    
    # Criar pagamentos
    for payment_data in sale_data.payments:
        payment = SalePayment(
            id=str(uuid.uuid4()),
            sale_id=sale.id,
            type=payment_data.type,
            amount=payment_data.amount,
            reference=payment_data.reference
        )
        db.add(payment)
    
    await db.commit()
    
    return {
        "success": True,
        "data": {
            "sale": {
                "id": sale.id,
                "saleId": sale.sale_id
            },
            "duplicated": False
        }
    }


@router.put("/sales/cancel")
async def cancel_sale(
    sale_id: str,
    reason: str = "",
    db: AsyncSession = Depends(get_db)
):
    """
    Cancelar venda
    """
    result = await db.execute(
        select(Sale).where(Sale.sale_id == sale_id)
    )
    sale = result.scalar_one_or_none()
    
    if not sale:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venda não encontrada"
        )
    
    if sale.status == "CANCELLED":
        return {
            "success": True,
            "data": {
                "message": "Venda já cancelada (idempotente)"
            }
        }
    
    # Cancelar venda
    sale.status = "CANCELLED"
    
    # Estornar estoque
    items_result = await db.execute(
        select(SaleItem).where(SaleItem.sale_id == sale.id)
    )
    items = items_result.scalars().all()
    
    for item in items:
        stock_result = await db.execute(
            select(StockItem).where(
                StockItem.store_id == sale.store_id,
                StockItem.product_id == item.product_id
            )
        )
        stock_item = stock_result.scalar_one_or_none()
        
        if stock_item:
            previous_qty = stock_item.quantity
            stock_item.quantity += item.quantity
            
            # Registrar movimentação
            movement = StockMovement(
                id=str(uuid.uuid4()),
                stock_item_id=stock_item.id,
                type="ENTRY_RETURN",
                quantity=item.quantity,
                previous_qty=previous_qty,
                new_qty=stock_item.quantity,
                origin=f"Cancelamento venda {sale_id} - {reason}",
                reference_id=sale.id,
                created_at=datetime.utcnow()
            )
            db.add(movement)
    
    await db.commit()
    
    return {
        "success": True,
        "data": {
            "message": "Venda cancelada com sucesso"
        }
    }


@router.post("/sync")
async def sync_pdv(
    last_sync_at: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Sincronização completa
    """
    since = datetime.utcnow()
    if last_sync_at:
        since = datetime.fromisoformat(last_sync_at.replace('Z', '+00:00'))
    
    # Produtos atualizados
    products_result = await db.execute(
        select(Product).where(
            Product.updated_at > since,
            Product.deleted_at.is_(None)
        )
    )
    products = products_result.scalars().all()
    
    # Clientes atualizados
    customers_result = await db.execute(
        select(Customer).where(
            Customer.updated_at > since,
            Customer.active == True
        )
    )
    customers = customers_result.scalars().all()
    
    return {
        "success": True,
        "data": {
            "products": [
                {
                    "id": p.id,
                    "code": p.code,
                    "description": p.description,
                    "salePrice": str(p.sale_price)
                }
                for p in products
            ],
            "customers": [
                {
                    "id": c.id,
                    "name": c.name,
                    "document": c.document
                }
                for c in customers
            ],
            "serverTime": datetime.utcnow().isoformat()
        }
    }
