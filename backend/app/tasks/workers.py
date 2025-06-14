from app.tasks.celery_app import celery_app
from app.core.price_binanace import fetch_and_cache_usdt_symbols
import asyncio


# Test task
@celery_app.task(name="app.tasks.workers.test_task")
def test_task():
    print("Task ran")


# Fetch and cache available coins in redis task
@celery_app.task(name="app.tasks.workers.refresh_usdt_coin_list")
def refresh_usdt_coin_list():
    asyncio.run(fetch_and_cache_usdt_symbols())
