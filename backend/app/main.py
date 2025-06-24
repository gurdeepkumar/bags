from fastapi import FastAPI
from app.routes import user, asset, portfolio

# Main FastAPI instance
app = FastAPI(
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)


# Including the sub routes
app.include_router(user.router)
app.include_router(asset.router)
app.include_router(portfolio.router)
