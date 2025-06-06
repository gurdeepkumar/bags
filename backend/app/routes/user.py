from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.schemas.user import (
    UserCreate,
    LoginRequest,
    TokenResponse,
    TokenRefreshRequest,
    AccessTokenResponse,
    UserProfile,
)
from app.models import User
from app.core.security import hash_password, verify_password
from app.db.deps import get_db
from app.core.jwt import create_refresh_token, create_access_token
from app.core.user_deps import get_current_user

router = APIRouter(prefix="/usr", tags=["User"])


@router.get("/")
def health_check(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        db.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception:
        db_status = "unreachable"

    return {
        "status": "Server is running",
        "database": db_status,
        "username": current_user.username,
    }


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pw,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


@router.post("/login", response_model=TokenResponse)
def login(user_input: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.query(User).filter(User.email == user_input.email).first()

    if not user or not verify_password(user_input.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    refresh_token = create_refresh_token(user.username)
    access_token = create_access_token(refresh_token)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/refresh-token", response_model=AccessTokenResponse)
def refresh_token(request: TokenRefreshRequest) -> AccessTokenResponse:
    try:
        new_token = create_access_token(request.refresh_token)
        return AccessTokenResponse(access_token=new_token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return UserProfile(
        username=current_user.username,
        email=current_user.email,
    )
