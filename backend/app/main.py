from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user, asset, portfolio
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware


# Main FastAPI instance
app = FastAPI(
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
    debug=False,
)

# CORS
origins = [
    "https://bags.gurdeepkumar.com",
    "https://bags-api.gurdeepkumar.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HTTPS
app.add_middleware(HTTPSRedirectMiddleware)

# Including the sub routes
app.include_router(user.router)
app.include_router(asset.router)
app.include_router(portfolio.router)
