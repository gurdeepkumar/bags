from fastapi import FastAPI, Depends
from app.db.deps import get_db
from sqlalchemy.orm import Session

app = FastAPI()


@app.get("/")
def read_users(db: Session = Depends(get_db)):
    return "This returns a db session test."
