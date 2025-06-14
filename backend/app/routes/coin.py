from fastapi import APIRouter, HTTPException
from app.core.cache import redis_client
from app.core.price_binanace import get_coin_price, get_cached_usdt_symbols
import json

router = APIRouter(prefix="/coin", tags=["Coin"])


@router.get("/price/{coin_id}")
async def get_price(coin_id: str):
    try:
        coin_data = await get_coin_price(coin_id.upper())

        return {
            "symbol": coin_data["symbol"],
            "price": coin_data["price"],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/prices")
async def get_cached_prices():
    try:
        # Get all keys that match the pattern
        keys = await redis_client.keys("price:*")
        prices = {}

        for key in keys:
            symbol = key.decode().split(":")[1]
            value = await redis_client.get(key)
            prices[symbol] = json.loads(value)

        return prices

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list")
async def list_usdt_coins():
    symbols = await get_cached_usdt_symbols()
    if not symbols:
        raise HTTPException(
            status_code=503, detail="Coin list not available. Please try later."
        )
    return {"usdt_symbols": symbols}
