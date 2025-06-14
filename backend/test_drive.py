# Testing any function or feature on the go

import asyncio
import json
from app.core.portfolio import get_user_assets_with_transactions
from app.db.deps import test_db


async def print_tx():
    with test_db() as db:
        txs = get_user_assets_with_transactions(db=db, user_id=2)
        print(json.dumps(txs, indent=4, ensure_ascii=False, default=str))


asyncio.run(print_tx())
