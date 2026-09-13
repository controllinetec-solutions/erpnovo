"""
ERP Lite - Sales Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from app.core.database import get_db
from app.models.sale import Sale

router = APIRouter()


@router.get("/")
async def list_sales(
    status_filter: Optional[str] = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Listar vendas
    """
    query = select(Sale)
    
    if status_filter:
        query = query.where(Sale.status == status_filter.upper())
    
    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination
    query = query.order_by(Sale.date.desc()).offset((page - 1) * limit).limit(limit)
    
    result = await db.execute(query)
    sales = result.scalars().all()
    
    return {
        "success": True,
        "data": [
            {
                "id": sale.id,
                "saleId": sale.sale_id,
                "storeId": sale.store_id,
                "terminalId": sale.terminal_id,
                "operatorId": sale.operator_id,
                "date": sale.date.isoformat(),
                "total": str(sale.total),
                "status": sale.status,
                "synced": sale.synced
            }
            for sale in sales
        ],
        "meta": {
            "page": page,
            "limit": limit,
            "total": total
        }
    }


@router.get("/{sale_id}")
async def get_sale(
    sale_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Obter venda por ID
    """
    result = await db.execute(select(Sale).where(Sale.id == sale_id))
    sale = result.scalar_one_or_none()
    
    if not sale:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venda não encontrada"
        )
    
    return {
        "success": True,
        "data": {
            "id": sale.id,
            "saleId": sale.sale_id,
            "storeId": sale.store_id,
            "terminalId": sale.terminal_id,
            "operatorId": sale.operator_id,
            "date": sale.date.isoformat(),
            "subtotal": str(sale.subtotal),
            "discount": str(sale.discount),
            "total": str(sale.total),
            "status": sale.status,
            "synced": sale.synced
        }
    }
