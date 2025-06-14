from app.db.session import SessionLocal
from contextlib import contextmanager


# DB instance for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# DB instance for testing
@contextmanager
def test_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
