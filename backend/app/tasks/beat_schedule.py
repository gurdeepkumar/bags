from celery.schedules import schedule
from app.tasks.celery_app import celery_app

# Regular check tasks
celery_app.conf.beat_schedule = {
    "refresh-binance-usdt-list-every-5-min": {
        "task": "app.tasks.workers.refresh_usdt_coin_list",
        "schedule": schedule(300.0),
    },
    "refresh-user-asset-prices-every-5-sec": {
        "task": "app.tasks.workers.refresh_user_asset_prices",
        "schedule": schedule(5.0),
    },
}
