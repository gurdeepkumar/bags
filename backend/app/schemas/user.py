from pydantic import BaseModel, EmailStr, Field, field_validator
import re


def is_valid_password(password: str) -> bool:
    return bool(re.match(r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%!&]{8,}$", password))


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str = Field(..., min_length=8)

    @field_validator("password", check_fields=False)
    @classmethod
    def validate_password(cls, value):
        if not is_valid_password(value):
            raise ValueError("Password must include both letters and numbers.")
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserProfile(BaseModel):
    username: str
    email: EmailStr


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str


class TokenRefreshRequest(BaseModel):
    refresh_token: str


class AccessTokenResponse(BaseModel):
    access_token: str


class UpdatePasswordRequest(BaseModel):
    email: EmailStr
    old_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)

    @field_validator("old_password", "new_password")
    @classmethod
    def validate_password(cls, value):
        if not is_valid_password(value):
            raise ValueError("Password must include both letters and numbers.")
        return value


class DeleteUserRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if not is_valid_password(value):
            raise ValueError("Password must include both letters and numbers.")
        return value
