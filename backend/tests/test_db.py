from app.db.deps import test_db
from sqlalchemy import text


# DB test
def test_get_db():
    with test_db() as db:
        result = db.execute(text("SELECT current_database();"))
        assert result.scalar() == "bags"
    with test_db() as db:
        result = db.execute(text("SELECT current_database();"))
        assert not result.scalar() == "something"
