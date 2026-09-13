"""
ERP Lite - Suppliers Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.core.database import get_db
from app.models.supplier import Supplier
from app.schemas.supplier import SupplierCreate, SupplierUpdate, SupplierResponse

router = APIRouter()


@router.get("/")
async def list_suppliers(
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Listar fornecedores
    """
    query = select(Supplier).where(Supplier.active == True)
    
    if search:
        query = query.where(
            Supplier.name.ilike(f"%{search}%") |
            Supplier.document.ilike(f"%{search}%")
        )
    
    query = query.order_by(Supplier.name)
    result = await db.execute(query)
    suppliers = result.scalars().all()
    
    return {
        "success": True,
        "data": [SupplierResponse.model_validate(s).model_dump() for s in suppliers]
    }


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_supplier(
    supplier_data: SupplierCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Criar novo fornecedor
    """
    supplier = Supplier(**supplier_data.model_dump())
    db.add(supplier)
    await db.commit()
    await db.refresh(supplier)
    
    return {
        "success": True,
        "data": SupplierResponse.model_validate(supplier).model_dump()
    }
