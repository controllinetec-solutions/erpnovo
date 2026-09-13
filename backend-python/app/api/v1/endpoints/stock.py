"""
ERP Lite - Stock Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from datetime import datetime
import uuid
from decimal import Decimal

from app.core.database import get_db
from app.models.stock import StockItem, StockMovement
from app.models.product import Product

router = APIRouter()


@router.get("/")
async def list_stock(
    store_id: Optional[str] = None,
    low_stock: Optional[bool] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Listar itens de estoque
    """
    query = select(StockItem).join(Product)
    
    if store_id:
        query = query.where(StockItem.store_id == store_id)
    
    result = await db.execute(query)
    items = result.scalars().all()
    
    stock_data = []
    for item in items:
        product_result = await db.execute(select(Product).where(Product.id == item.product_id))
        product = product_result.scalar_one()
        
        is_low = float(item.quantity) <= product.min_stock
        
        if low_stock is not None and is_low != low_stock:
            continue
        
        stock_data.append({
            "id": item.id,
            "productId": item.product_id,
            "productName": product.description,
            "barcode": product.barcode,
            "storeId": item.store_id,
            "quantity": str(item.quantity),
            "minStock": product.min_stock,
            "unit": product.unit,
            "costPrice": str(product.cost_price),
            "totalValue": str(float(item.quantity) * float(product.cost_price)),
            "status": "low" if is_low else "normal"
        })
    
    return {
        "success": True,
        "data": stock_data
    }


@router.get("/movements")
async def list_movements(
    store_id: Optional[str] = None,
    product_id: Optional[str] = None,
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db)
):
    """
    Listar movimentações de estoque
    """
    query = select(StockMovement).order_by(StockMovement.created_at.desc()).limit(limit)
    
    result = await db.execute(query)
    movements = result.scalars().all()
    
    movements_data = []
    for movement in movements:
        stock_item_result = await db.execute(
            select(StockItem).where(StockItem.id == movement.stock_item_id)
        )
        stock_item = stock_item_result.scalar_one_or_none()
        
        product_name = "Produto removido"
        if stock_item:
            product_result = await db.execute(select(Product).where(Product.id == stock_item.product_id))
            product = product_result.scalar_one_or_none()
            if product:
                product_name = product.description
        
        movements_data.append({
            "id": movement.id,
            "productId": stock_item.product_id if stock_item else None,
            "productName": product_name,
            "type": movement.type,
            "quantity": str(movement.quantity),
            "previousQty": str(movement.previous_qty),
            "newQty": str(movement.new_qty),
            "origin": movement.origin,
            "date": movement.created_at.isoformat()
        })
    
    return {
        "success": True,
        "data": movements_data
    }


@router.post("/adjustment")
async def adjust_stock(
    product_id: str,
    store_id: str,
    new_quantity: float,
    reason: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Ajustar estoque manualmente
    """
    # Buscar ou criar stock item
    result = await db.execute(
        select(StockItem).where(
            StockItem.store_id == store_id,
            StockItem.product_id == product_id
        )
    )
    stock_item = result.scalar_one_or_none()
    
    if not stock_item:
        stock_item = StockItem(
            id=str(uuid.uuid4()),
            store_id=store_id,
            product_id=product_id,
            quantity=Decimal(0)
        )
        db.add(stock_item)
        await db.flush()
    
    previous_qty = stock_item.quantity
    stock_item.quantity = Decimal(str(new_quantity))
    
    # Registrar movimentação
    movement = StockMovement(
        id=str(uuid.uuid4()),
        stock_item_id=stock_item.id,
        type="ENTRY_ADJUSTMENT" if new_quantity > float(previous_qty) else "EXIT_ADJUSTMENT",
        quantity=abs(Decimal(str(new_quantity)) - previous_qty),
        previous_qty=previous_qty,
        new_qty=stock_item.quantity,
        origin=reason,
        created_at=datetime.utcnow()
    )
    db.add(movement)
    
    await db.commit()
    
    return {
        "success": True,
        "data": {
            "message": "Estoque ajustado com sucesso",
            "previousQty": str(previous_qty),
            "newQty": str(stock_item.quantity)
        }
    }
