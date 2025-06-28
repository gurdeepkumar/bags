from pydantic import BaseModel, Field, StringConstraints
from typing import Annotated, Optional
from datetime import datetime


class AssetCreate(BaseModel):
    coin_symbol: Annotated[
        str,
        StringConstraints(strip_whitespace=True, min_length=1),
    ]


class TransactionCreate(BaseModel):
    asset_id: int
    qty: float
    value: float


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
    qty: Optional[float]
    value: Optional[float]


class TransactionResponse(BaseModel):
    tx_id: int
    qty: float
    value: float
    timestamp: datetime

    @classmethod
    def from_orm(cls, obj):
        return cls(
            tx_id=obj.id,
            qty=obj.qty,
            value=obj.value,
            timestamp=obj.timestamp,
        )

    class Config:
        from_attributes = True
