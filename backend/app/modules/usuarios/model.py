
from datetime import datetime, timezone

from sqlalchemy import Column, String
from sqlmodel import Field, SQLModel


class Usuario(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    username: str = Field(
        sa_column=Column(String(50), unique=True, index=True, nullable=False)
    )

    full_name: str = Field(
        sa_column=Column(String(150), nullable=False)
    )

    email: str = Field(
        sa_column=Column(String(255), unique=True, index=True, nullable=False)
    )

    hashed_password: str = Field(
        sa_column=Column(String(255), nullable=False)
    )

    role: str = Field(
        default="user",
        sa_column=Column(String(20), nullable=False)
    )

    disabled: bool = Field(default=False, nullable=False)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
