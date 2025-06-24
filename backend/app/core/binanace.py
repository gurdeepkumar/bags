from httpx import AsyncClient
from app.core.cache import redis_client
from dotenv import load_dotenv
import os

load_dotenv()

BINANCE_API = f"https://api.binance.com/api/v3/ticker/price"
REDIS_LIST_KEY = "usdt_symbols"
USER_SYMBOL_PRICE_KEY = "user_symbol_prices"
CACHED_USDT_SYMBOLS_TTL = os.getenv("CACHED_USDT_SYMBOLS_TTL")
CACHED_USDT_PRICES_TTL = os.getenv("CACHED_USDT_PRICES_TTL")


# Fetch list of available symbols from binance
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
        await redis_client.expire(REDIS_LIST_KEY, CACHED_USDT_SYMBOLS_TTL)


# Return list of available symbols from cache
async def get_cached_usdt_symbols():
    cached_list = await redis_client.smembers(REDIS_LIST_KEY)
    if cached_list:
        return cached_list
    return None


# Fetch all prices from Binance and cache only USDT pairs
async def fetch_and_cache_user_asset_prices():
    async with AsyncClient() as client:
        response = await client.get(BINANCE_API)
        response.raise_for_status()
        all_prices = response.json()

        prices_to_cache = {}
        for item in all_prices:
            symbol = item["symbol"]
            if symbol.endswith("USDT"):
                coin = symbol[:-4]  # strip "USDT"
                prices_to_cache[coin] = item["price"]

        if prices_to_cache:
            await redis_client.hset(USER_SYMBOL_PRICE_KEY, mapping=prices_to_cache)
            await redis_client.expire(USER_SYMBOL_PRICE_KEY, CACHED_USDT_PRICES_TTL)
