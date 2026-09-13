"""
ERP Lite - Dashboard Endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta
from decimal import Decimal

from app.core.database import get_db
from app.models.sale import Sale
from app.models.product import Product
from app.models.terminal import Terminal
from app.models.stock import StockItem

router = APIRouter()


@router.get("/")
async def get_dashboard(
    db: AsyncSession = Depends(get_db)
):
    """
    Obter dados do dashboard
    """
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = today.replace(day=1)
    
    # Vendas de hoje
    today_sales_result = await db.execute(
        select(Sale).where(
            Sale.date >= today,
            Sale.status == "COMPLETED"
        )
    )
    today_sales = today_sales_result.scalars().all()
    today_total = sum(float(s.total) for s in today_sales)
    today_count = len(today_sales)
    
    # Vendas do mês
    month_sales_result = await db.execute(
        select(func.sum(Sale.total)).where(
            Sale.date >= month_start,
            Sale.status == "COMPLETED"
        )
    )
    month_total = month_sales_result.scalar() or 0
    
    # Ticket médio
    average_ticket = today_total / today_count if today_count > 0 else 0
    
    # Terminais
    terminals_result = await db.execute(select(Terminal))
    terminals = terminals_result.scalars().all()
    online_terminals = len([t for t in terminals if t.status == "ONLINE"])
    
    # Produtos com estoque baixo
    products_result = await db.execute(select(Product).where(Product.status == "ACTIVE"))
    products = products_result.scalars().all()
    low_stock_count = 0
    
    for product in products:
        stock_result = await db.execute(
            select(StockItem).where(
                StockItem.store_id == product.store_id,
                StockItem.product_id == product.id
            )
        )
        stock_item = stock_result.scalar_one_or_none()
        if stock_item and float(stock_item.quantity) <= product.min_stock:
            low_stock_count += 1
    
    return {
        "success": True,
        "data": {
            "todaySales": today_total,
            "todaySalesCount": today_count,
            "averageTicket": average_ticket,
            "monthRevenue": float(month_total),
            "lowStockProducts": low_stock_count,
            "onlineTerminals": online_terminals,
            "totalTerminals": len(terminals),
            "timestamp": datetime.utcnow().isoformat()
        }
    }
