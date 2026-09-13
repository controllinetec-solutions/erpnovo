"""
ERP Lite - Terminals Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.terminal import Terminal

router = APIRouter()


@router.get("/")
async def list_terminals(
    db: AsyncSession = Depends(get_db)
):
    """
    Listar todos os terminais PDV
    """
    result = await db.execute(select(Terminal))
    terminals = result.scalars().all()
    
    return {
        "success": True,
        "data": [
            {
                "id": t.id,
                "name": t.name,
                "storeId": t.store_id,
                "status": t.status.lower(),
                "pdvVersion": t.pdv_version,
                "lastSync": t.last_sync.isoformat() if t.last_sync else None,
                "lastAccess": t.last_access.isoformat() if t.last_access else None,
            }
            for t in terminals
        ]
    }


@router.get("/{terminal_id}")
async def get_terminal(
    terminal_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Obter terminal por ID
    """
    result = await db.execute(select(Terminal).where(Terminal.id == terminal_id))
    terminal = result.scalar_one_or_none()
    
    if not terminal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Terminal não encontrado"
        )
    
    return {
        "success": True,
        "data": {
            "id": terminal.id,
            "name": terminal.name,
            "storeId": terminal.store_id,
            "status": terminal.status.lower(),
            "pdvVersion": terminal.pdv_version,
            "lastSync": terminal.last_sync.isoformat() if terminal.last_sync else None,
            "lastAccess": terminal.last_access.isoformat() if terminal.last_access else None,
        }
    }
