from fastapi import APIRouter, Depends
from app.core.portfolio import get_user_assets_with_transactions

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])


# Return user portfolio
@router.get("")
def get_portfolio(data=Depends(get_user_assets_with_transactions)):
    return {"data": data}
