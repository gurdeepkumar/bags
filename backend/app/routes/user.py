from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy import false
from sqlalchemy.orm import Session

from app.schemas.user import (
    UserCreate,
    LoginRequest,
    AccessTokenResponse,
    UserProfile,
    UpdatePasswordRequest,
    DeleteUserRequest,
)
from app.models import User
from app.core.security import hash_password, verify_password
from app.db.deps import get_db
from app.core.jwt import create_refresh_token, create_access_token
from app.core.user_deps import get_current_user
from fastapi import Response

router = APIRouter(prefix="/usr", tags=["User"])


# Create user with username, email and password
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if email or username already exists
    existing_user = (
        db.query(User)
        .filter((User.email == user.email) | (User.username == user.username))
        .first()
    )

    if existing_user:
        # Determine which field is duplicated to provide clearer error message
        if existing_user.email == user.email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Username already taken"
            )

    hashed_pw = hash_password(user.password)

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pw,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"data": "User registered successfully"}


# Get refresh and access token with email and password
@router.post("/login")
def login(user_input: LoginRequest, db: Session = Depends(get_db)) -> None:

    response = Response(content="Cookie set")

    user = db.query(User).filter(User.email == user_input.email).first()

    if not user or not verify_password(user_input.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    refresh_token = create_refresh_token(user.username)

    # Set the refresh token as HttpOnly cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="none",
        secure=True,
        path="/",
        expires=60 * 60 * 24,
    )

    # No response body needed, just 204 No Content
    return response


# Get a new access token using refresh token
@router.post("/refresh-token", response_model=AccessTokenResponse)
def refresh_token(request: Request) -> AccessTokenResponse:
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    try:
        new_token = create_access_token(refresh_token)
        return AccessTokenResponse(access_token=new_token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


# Get user from an access token
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return UserProfile(
        username=current_user.username,
        email=current_user.email,
    )


# Update new password with email and old password
@router.put("/update-password")
def update_password(data: UpdatePasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.old_password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


# Delete user with email and password
@router.delete("")
def delete_user(data: DeleteUserRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
