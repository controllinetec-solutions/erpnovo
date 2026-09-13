"""
ERP Lite - Testes da API
"""

import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_health_check():
    """Testa endpoint de health check"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data


@pytest.mark.asyncio
async def test_root():
    """Testa endpoint raiz"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/")
    
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "ERP Lite API"


@pytest.mark.asyncio
async def test_login_invalid_credentials():
    """Testa login com credenciais inválidas"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/auth/login",
            json={"email": "invalid@test.com", "password": "wrong"}
        )
    
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_products_unauthorized():
    """Testa acesso a produtos sem autenticação"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/products")
    
    # Deve retornar 401 ou 403
    assert response.status_code in [401, 403, 422]


@pytest.mark.asyncio
async def test_not_found():
    """Testa endpoint inexistente"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/nonexistent")
    
    assert response.status_code == 404
