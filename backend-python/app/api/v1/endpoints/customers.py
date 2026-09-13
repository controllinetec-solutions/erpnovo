"""
ERP Lite - Customers Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.core.database import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse

router = APIRouter()


@router.get("/")
async def list_customers(
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Listar clientes
    """
    query = select(Customer).where(Customer.active == True)
    
    if search:
        query = query.where(
            Customer.name.ilike(f"%{search}%") |
            Customer.document.ilike(f"%{search}%")
        )
    
    query = query.order_by(Customer.name)
    result = await db.execute(query)
    customers = result.scalars().all()
    
    return {
        "success": True,
        "data": [CustomerResponse.model_validate(c).model_dump() for c in customers]
    }


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_customer(
    customer_data: CustomerCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Criar novo cliente
    """
    customer = Customer(**customer_data.model_dump())
    db.add(customer)
    await db.commit()
    await db.refresh(customer)
    
    return {
        "success": True,
        "data": CustomerResponse.model_validate(customer).model_dump()
    }
