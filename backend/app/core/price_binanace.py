import json
from httpx import AsyncClient
from app.core.cache import redis_client

BINANCE_API = f"https://api.binance.com/api/v3/ticker/price"
REDIS_LIST_KEY = "usdt_symbols"


async def get_coin_price(coin_name: str) -> dict:
    coin_symbol = (coin_name.upper()) + "USDT"
    cache_key = f"price:{coin_symbol.upper()}"

    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    params = {"symbol": coin_symbol.upper()}

    async with AsyncClient() as client:
        response = await client.get(BINANCE_API, params=params)

        if response.status_code == 200:
            data = response.json()
            await redis_client.set(cache_key, json.dumps(data), ex=60)
            return data
        else:
            raise Exception(f"Binance API error: {response.status_code}")


async def fetch_and_cache_usdt_symbols():
    async with AsyncClient() as client:
        response = await client.get(BINANCE_API)
        response.raise_for_status()

        symbols = {
            item["symbol"][:-4]
            for item in response.json()
            if item["symbol"].endswith("USDT")
        }

        await redis_client.sadd(REDIS_LIST_KEY, *symbols)
        await redis_client.expire(REDIS_LIST_KEY, 3600)


async def get_cached_usdt_symbols():
    cached_list = await redis_client.smembers(REDIS_LIST_KEY)
    if cached_list:
        return cached_list
    return None
