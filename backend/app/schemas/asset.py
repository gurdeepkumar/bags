from pydantic import BaseModel, Field, StringConstraints
from typing import Annotated, Optional
from datetime import datetime


class AssetOrTransactionCreate(BaseModel):
    coin_symbol: Annotated[
        str,
        StringConstraints(strip_whitespace=True, min_length=1),
    ]
    amount: float
    purchase_price: float


class AssetResponse(BaseModel):
    id: int
    coin_symbol: str
    created_at: datetime

    class Config:
        from_attributes = True


class TransactionUpdate(BaseModel):
    amount: Optional[float]
    price: Optional[float]


class TransactionResponse(BaseModel):
    id: int
    amount: float
    price: float
    timestamp: datetime

    class Config:
        from_attributes = True
