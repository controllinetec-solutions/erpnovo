"""
ERP Lite - Auth Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.core.database import get_db
from app.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user
)
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse, RefreshTokenRequest
from app.core.config import settings

router = APIRouter()


@router.post("/login")
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Realizar login
    """
    # Buscar usuário
    result = await db.execute(
        select(User).where(User.email == login_data.email)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos"
        )
    
    # Verificar senha
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos"
        )
    
    # Verificar se está ativo
    if not user.active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário desativado"
        )
    
    # Criar tokens
    token_data = {
        "sub": user.id,
        "company_id": user.company_id,
        "store_id": user.store_id,
        "role": user.role
    }
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    # Atualizar último login
    user.last_login = datetime.utcnow()
    await db.commit()
    
    # Buscar dados da loja e empresa
    from app.models.company import Store, Company
    
    store_result = await db.execute(select(Store).where(Store.id == user.store_id))
    store = store_result.scalar_one()
    
    company_result = await db.execute(select(Company).where(Company.id == user.company_id))
    company = company_result.scalar_one()
    
    return {
        "success": True,
        "data": {
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role.lower(),
                "storeId": user.store_id,
                "storeName": store.name,
                "companyId": user.company_id,
                "companyName": company.name,
                "permissions": user.permissions,
                "active": user.active,
                "lastLogin": user.last_login.isoformat() if user.last_login else None
            },
            "tokens": {
                "accessToken": access_token,
                "refreshToken": refresh_token,
                "expiresIn": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
            }
        }
    }


@router.post("/refresh")
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Renovar token de acesso
    """
    try:
        payload = decode_token(refresh_data.refresh_token)
        
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido"
            )
        
        user_id = payload.get("sub")
        
        # Buscar usuário
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        
        if not user or not user.active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário inválido ou desativado"
            )
        
        # Criar novos tokens
        token_data = {
            "sub": user.id,
            "company_id": user.company_id,
            "store_id": user.store_id,
            "role": user.role
        }
        
        access_token = create_access_token(token_data)
        new_refresh_token = create_refresh_token(token_data)
        
        return {
            "success": True,
            "data": {
                "accessToken": access_token,
                "refreshToken": new_refresh_token,
                "expiresIn": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
            }
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido: {str(e)}"
        )


@router.post("/logout")
async def logout():
    """
    Realizar logout
    """
    return {
        "success": True,
        "data": {
            "message": "Logout realizado com sucesso"
        }
    }


@router.get("/me")
async def get_current_user_info(
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Obter informações do usuário atual autenticado
    """
    # Buscar dados da loja e empresa
    from app.models.company import Store, Company
    
    store_result = await db.execute(select(Store).where(Store.id == current_user.store_id))
    store = store_result.scalar_one()
    
    company_result = await db.execute(select(Company).where(Company.id == current_user.company_id))
    company = company_result.scalar_one()
    
    return {
        "success": True,
        "data": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": current_user.role.lower(),
            "storeId": current_user.store_id,
            "storeName": store.name,
            "companyId": current_user.company_id,
            "companyName": company.name,
            "permissions": current_user.permissions,
            "active": current_user.active,
            "lastLogin": current_user.last_login.isoformat() if current_user.last_login else None
        }
    }
