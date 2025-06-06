from fastapi import FastAPI
from app.routes import user, asset

app = FastAPI(
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)

app.include_router(user.router)
app.include_router(asset.router)
