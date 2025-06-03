from app.db.deps import get_db
from sqlalchemy import text


def test_get_db():
    with get_db() as db:
        result = db.execute(text("SELECT current_database();"))
        assert result.scalar() == "bags"
    with get_db() as db:
        result = db.execute(text("SELECT current_database();"))
        assert not result.scalar() == "something"
