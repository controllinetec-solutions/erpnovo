"""
ERP Lite - Products Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from decimal import Decimal

from app.core.database import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter()


@router.get("/")
async def list_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Listar produtos
    """
    query = select(Product).where(Product.deleted_at.is_(None))
    
    if search:
        query = query.where(
            Product.description.ilike(f"%{search}%") |
            Product.barcode.ilike(f"%{search}%") |
            Product.code.ilike(f"%{search}%")
        )
    
    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination
    query = query.offset((page - 1) * limit).limit(limit)
    
    result = await db.execute(query)
    products = result.scalars().all()
    
    return {
        "success": True,
        "data": [ProductResponse.model_validate(p).model_dump() for p in products],
        "meta": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit
        }
    }


@router.get("/{product_id}")
async def get_product(
    product_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Obter produto por ID
    """
    result = await db.execute(
        select(Product).where(Product.id == product_id, Product.deleted_at.is_(None))
    )
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )
    
    return {
        "success": True,
        "data": ProductResponse.model_validate(product).model_dump()
    }


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Criar novo produto
    """
    # Calcular margem
    margin = ((product_data.sale_price - product_data.cost_price) / product_data.sale_price) * 100
    
    product = Product(
        **product_data.model_dump(),
        margin=margin
    )
    
    db.add(product)
    await db.commit()
    await db.refresh(product)
    
    return {
        "success": True,
        "data": ProductResponse.model_validate(product).model_dump()
    }


@router.put("/{product_id}")
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    Atualizar produto
    """
    result = await db.execute(
        select(Product).where(Product.id == product_id, Product.deleted_at.is_(None))
    )
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )
    
    # Atualizar campos
    update_data = product_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    
    # Recalcular margem se preços mudaram
    if "cost_price" in update_data or "sale_price" in update_data:
        product.margin = ((product.sale_price - product.cost_price) / product.sale_price) * 100
    
    # Incrementar versão
    product.version += 1
    
    await db.commit()
    await db.refresh(product)
    
    return {
        "success": True,
        "data": ProductResponse.model_validate(product).model_dump()
    }


@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Deletar produto (soft delete)
    """
    from datetime import datetime
    
    result = await db.execute(
        select(Product).where(Product.id == product_id, Product.deleted_at.is_(None))
    )
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )
    
    product.deleted_at = datetime.utcnow()
    product.status = "INACTIVE"
    
    await db.commit()
    
    return {
        "success": True,
        "data": {
            "message": "Produto desativado com sucesso"
        }
    }
