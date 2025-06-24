from celery import Celery
from dotenv import load_dotenv
import os

load_dotenv()

# Redis settings
REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = os.getenv("REDIS_PORT")
REDIS_DB = os.getenv("REDIS_DB")

REDIS_URL = f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}"

# Celery app instance
celery_app = Celery(
    "worker",
    broker=REDIS_URL,
)

celery_app.conf.timezone = "UTC"

print(REDIS_URL)
