from app.tasks.celery_app import celery_app
from app.core.binanace import (
    fetch_and_cache_user_asset_prices,
    fetch_and_cache_usdt_symbols,
)
import asyncio


# Loop
def run_async(func):
    try:
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

    loop.run_until_complete(func)


# Test task
@celery_app.task(name="app.tasks.workers.test_task")
def test_task():
    print("Task ran")


# Fetch and cache available coins in redis task
@celery_app.task(name="app.tasks.workers.refresh_usdt_coin_list")
def refresh_usdt_coin_list():
    run_async(fetch_and_cache_usdt_symbols())
    # asyncio.run(fetch_and_cache_usdt_symbols())


# Fetch and cache user asset prices task
@celery_app.task(name="app.tasks.workers.refresh_user_asset_prices")
def refresh_user_asset_prices():
    run_async(fetch_and_cache_user_asset_prices())
    # asyncio.run(fetch_and_cache_user_asset_prices())
