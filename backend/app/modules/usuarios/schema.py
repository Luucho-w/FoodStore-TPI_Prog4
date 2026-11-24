from datetime import datetime
from typing import Literal

from pydantic import EmailStr, Field
from sqlmodel import SQLModel



class UserCreate(SQLModel):
    username: str = Field(
        min_length=3,
        max_length=50,
        strip_whitespace=True,
    )
    full_name: str = Field(
        min_length=2,
        max_length=150,
        strip_whitespace=True,
    )
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)



class UserPublic(SQLModel):
    id: int
    username: str
    full_name: str
    email: EmailStr
    role: Literal["user", "admin"]
    disabled: bool
    created_at: datetime


class UsuarioAdminPublic(UserPublic):
    pass
