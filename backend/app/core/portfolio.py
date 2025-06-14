from sqlalchemy.orm import joinedload
from app.models.asset import Asset
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload


def get_user_assets_with_transactions(db: Session, user_id: int):
    result = {"assets": []}

    assets = (
        db.query(Asset)
        .options(joinedload(Asset.transactions))
        .filter(Asset.user_id == user_id)
        .all()
    )

    for asset in assets:
        transactions = [
            {
                "tx_id": t.id,
                "amount": float(t.amount),
                "price": float(t.price),
                "timestamp": t.timestamp.isoformat(),
            }
            for t in asset.transactions
        ]
        result["assets"].append({asset.coin_symbol.upper(): transactions})

    return result
