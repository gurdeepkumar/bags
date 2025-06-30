from fastapi import APIRouter, Depends, HTTPException, status, Request
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
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os

load_dotenv()

DEBUG = os.getenv("DEBUG")


router = APIRouter(prefix="/usr", tags=["User"])


# Create user with username, email and password
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, response: Response, db: Session = Depends(get_db)):
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

    refresh_token = create_refresh_token(user.username)
    access_token = create_access_token(refresh_token)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="none",
        secure=True if DEBUG else False,
        path="/",
        max_age=5 * 24 * 3600,
    )

    return {"access_token": access_token}


# Get refresh and access token with email and password
@router.post("/login")
def login(user_input: LoginRequest, response: Response, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == user_input.email).first()

    if not user or not verify_password(user_input.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    refresh_token = create_refresh_token(user.username)
    access_token = create_access_token(refresh_token)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="none",
        secure=True if DEBUG else False,
        path="/",
        max_age=5 * 24 * 3600,
    )

    return {"access_token": access_token}


# Logout
@router.post("/logout")
def logout(response: Response, request: Request):

    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    # Build proper JSON response
    response = JSONResponse(content={"message": "Logged out successfully."})
    response.delete_cookie(
        key="refresh_token",
        path="/",
    )
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
def update_password(
    data: UpdatePasswordRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    get_user = db.query(User).filter(User.email == data.email).first()

    if not get_user or not verify_password(data.old_password, get_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if current_user.username != get_user.username:
        raise HTTPException(
            status_code=403, detail="Username does not match logged-in user"
        )

    get_user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


# Delete user with email and password
@router.delete("")
def delete_user(
    data: DeleteUserRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    get_user = db.query(User).filter(User.email == data.email).first()
    if not get_user or not verify_password(data.password, get_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if current_user.username != get_user.username:
        raise HTTPException(
            status_code=403, detail="Username does not match logged-in user"
        )

    db.delete(get_user)
    db.commit()
    return {"message": "User deleted successfully"}
