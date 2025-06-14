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
    asset_id: int
    coin_symbol: str
    created_at: datetime

    @classmethod
    def from_orm(cls, obj):
        return cls(
            asset_id=obj.id,
            coin_symbol=obj.coin_symbol,
            created_at=obj.created_at,
        )

    class Config:
        from_attributes = True


class TransactionUpdate(BaseModel):
    amount: Optional[float]
    price: Optional[float]


class TransactionResponse(BaseModel):
    tx_id: int
    amount: float
    price: float
    timestamp: datetime

    @classmethod
    def from_orm(cls, obj):
        return cls(
            tx_id=obj.id,
            amount=obj.amount,
            price=obj.price,
            timestamp=obj.timestamp,
        )

    class Config:
        from_attributes = True
