from celery.schedules import crontab
from app.tasks.celery_app import celery_app

# Regular check for available coins
celery_app.conf.beat_schedule = {
    "refresh-binance-usdt-list-every-1-min": {
        "task": "app.tasks.workers.refresh_usdt_coin_list",
        "schedule": crontab(minute="*/1"),
    }
}
