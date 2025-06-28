from fastapi import Depends
from sqlalchemy.orm import Session, joinedload
from app.models.asset import Asset
from app.db.deps import get_db
from app.core.user_deps import get_current_user
from app.models import User
from app.core.cache import redis_client


# Return the portfolio stats
async def get_user_assets_with_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = {"assets": []}
    total_value_sum = 0.0
    total_pnl_sum = 0.0
    total_current_value_sum = 0.0

    top_gainer = None
    top_gainer_pnl = float("-inf")

    assets = (
        db.query(Asset)
        .options(joinedload(Asset.transactions))
        .filter(Asset.user_id == current_user.id)
        .all()
    )

    if assets:
        symbols = [asset.coin_symbol.upper() for asset in assets]
        prices_bytes = await redis_client.hmget("user_symbol_prices", *symbols)
        prices = {
            symbol: float(price.decode()) if price else 0.0
            for symbol, price in zip(symbols, prices_bytes)
        }

    for asset in assets:
        symbol = asset.coin_symbol.upper()
        total_qty = 0.0
        total_value = 0.0

        for t in asset.transactions:
            qty = float(t.qty)
            value = float(t.value)
            total_qty += qty
            total_value += value

        price = prices.get(symbol, 0.0)
        current_value = total_qty * price
        pnl = current_value - total_value

        total_value_sum += total_value
        total_pnl_sum += pnl
        total_current_value_sum += current_value

        if pnl > top_gainer_pnl:
            top_gainer_pnl = pnl
            top_gainer = symbol

        result["assets"].append(
            {
                symbol: {
                    "asset_id": asset.id,
                    "total_qty": round(total_qty, 4),
                    "spent_value": round(total_value, 2),
                    "current_price": round(price, 4),
                    "current_value": round(current_value, 2),
                    "pnl": round(pnl, 2),
                }
            }
        )

    result["total_spent_value"] = round(total_value_sum, 2)
    result["total_current_value"] = round(total_current_value_sum, 2)
    result["total_pnl"] = round(total_pnl_sum, 2)
    result["top_gainer"] = top_gainer

    return result
