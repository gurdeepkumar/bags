from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.core.user_deps import get_current_user
from app.models.asset import Asset
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.asset import (
    TransactionUpdate,
    TransactionResponse,
    AssetCreate,
    TransactionCreate,
    AssetResponse,
)
from typing import List
from app.core.cache import redis_client

router = APIRouter(prefix="/asset", tags=["Asset & Transactions"])


@router.post("", status_code=201)
async def create_asset(
    data: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    coin_upper = data.coin_symbol.upper()

    is_available = await redis_client.sismember("usdt_symbols", coin_upper)
    if not is_available:
        raise HTTPException(
            status_code=400,
            detail=f"Coin '{coin_upper}' is not available in the app yet.",
        )

    asset = (
        db.query(Asset)
        .filter(Asset.user_id == current_user.id, Asset.coin_symbol == coin_upper)
        .first()
    )
    if asset:
        return {"message": f"Asset '{coin_upper}' already exists."}

    asset = Asset(user_id=current_user.id, coin_symbol=coin_upper)
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return {
        "message": f"Asset '{coin_upper}' created successfully.",
        "asset_id": asset.id,
    }


@router.post("/transaction", response_model=TransactionResponse)
async def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    asset = (
        db.query(Asset)
        .filter(Asset.id == data.asset_id, Asset.user_id == current_user.id)
        .first()
    )
    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found or not owned by current user.",
        )

    if data.value < 0:
        raise HTTPException(
            status_code=400,
            detail="Transaction value cannot be negative.",
        )

    current_qty = sum(float(t.qty) for t in asset.transactions)

    if data.qty < 0 and current_qty + data.qty < 0:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient balance: cannot sell {abs(data.qty)} {asset.coin_symbol}. You only have {current_qty}.",
        )

    transaction = Transaction(asset_id=asset.id, qty=data.qty, value=data.value)
    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return TransactionResponse.from_orm(transaction)


# Send list of all assets
@router.get("", response_model=List[AssetResponse])
def list_all_assets(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    assets = db.query(Asset).filter(Asset.user_id == current_user.id).all()
    return [AssetResponse.from_orm(asset) for asset in assets]


# Send list of all tx of an asset
@router.get("/{asset_id}", response_model=List[TransactionResponse])
def list_transactions(
    asset_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    asset = (
        db.query(Asset)
        .filter(Asset.id == asset_id, Asset.user_id == current_user.id)
        .first()
    )
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    return [TransactionResponse.from_orm(tx) for tx in asset.transactions]


# Update a tx
@router.put("/transaction/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    data: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    transaction = (
        db.query(Transaction)
        .join(Asset)
        .filter(Transaction.id == transaction_id, Asset.user_id == current_user.id)
        .first()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if data.qty is not None:
        transaction.qty = data.qty
    if data.value is not None:
        transaction.value = data.value

    db.commit()
    db.refresh(transaction)
    return TransactionResponse.from_orm(transaction)


# Delete a tx
@router.delete("/transaction/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    transaction = (
        db.query(Transaction)
        .join(Asset)
        .filter(Transaction.id == transaction_id, Asset.user_id == current_user.id)
        .first()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(transaction)
    db.commit()
    return {"detail": f"Transaction with id: {transaction_id} deleted successfully"}


# Delete an asset
@router.delete("/{asset_id}")
def delete_asset_and_transactions(
    asset_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    asset = (
        db.query(Asset)
        .filter(Asset.id == asset_id, Asset.user_id == current_user.id)
        .first()
    )
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    db.delete(asset)
    db.commit()
    return {
        "detail": f"Asset with id: {asset_id} and all its transactions deleted successfully"
    }


# Return available assets list
@router.get("/all/")
async def get_all_usdt_assets(current_user=Depends(get_current_user)):
    symbols = await redis_client.smembers("usdt_symbols")
    if not symbols:
        raise HTTPException(status_code=404, detail="No USDT assets found in cache.")
    return {"symbols": sorted(list(symbols))}
