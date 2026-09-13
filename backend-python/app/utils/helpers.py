"""
ERP Lite - Funções Auxiliares
"""

from datetime import datetime
from decimal import Decimal
from typing import Any, Dict
import uuid


def generate_uuid() -> str:
    """Gera um UUID v4"""
    return str(uuid.uuid4())


def calculate_margin(cost_price: Decimal, sale_price: Decimal) -> Decimal:
    """Calcula a margem de lucro"""
    if sale_price == 0:
        return Decimal(0)
    return ((sale_price - cost_price) / sale_price) * 100


def format_currency(value: float, currency: str = "BRL") -> str:
    """Formata valor monetário"""
    return f"R$ {value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def parse_decimal(value: Any) -> Decimal:
    """Converte valor para Decimal"""
    if isinstance(value, Decimal):
        return value
    if isinstance(value, (int, float)):
        return Decimal(str(value))
    if isinstance(value, str):
        return Decimal(value.replace(",", "."))
    raise ValueError(f"Cannot convert {type(value)} to Decimal")


def now_utc() -> datetime:
    """Retorna datetime atual em UTC"""
    return datetime.utcnow()


def safe_dict(obj: Any) -> Dict:
    """Converte objeto para dict de forma segura"""
    if hasattr(obj, "__dict__"):
        return obj.__dict__
    if isinstance(obj, dict):
        return obj
    return {}
