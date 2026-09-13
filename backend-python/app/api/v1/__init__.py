"""
ERP Lite - API Routes
"""

from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, products, sales, customers, suppliers, 
    pdv, stock, terminals, dashboard
)

api_router = APIRouter()

# Incluir rotas
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(sales.router, prefix="/sales", tags=["Sales"])
api_router.include_router(customers.router, prefix="/customers", tags=["Customers"])
api_router.include_router(suppliers.router, prefix="/suppliers", tags=["Suppliers"])
api_router.include_router(stock.router, prefix="/stock", tags=["Stock"])
api_router.include_router(terminals.router, prefix="/terminals", tags=["Terminals"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(pdv.router, prefix="/pdv", tags=["PDV Integration"])
