from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user, asset, portfolio
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

DEBUG = os.getenv("DEBUG")


if DEBUG:
    app = FastAPI()
    origins = [
        "https://bags.gurdeepkumar.com",
        "https://bags-api.gurdeepkumar.com",
        "https://127.0.0.1:3000",
        "http://127.0.0.1:3000",
    ]
else:
    app = FastAPI(
        docs_url=None,
        redoc_url=None,
        openapi_url=None,
        debug=False,
    )
    origins = [
        "https://bags.gurdeepkumar.com",
        "https://bags-api.gurdeepkumar.com",
    ]
    app.add_middleware(HTTPSRedirectMiddleware)


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Including the sub routes
app.include_router(user.router)
app.include_router(asset.router)
app.include_router(portfolio.router)
