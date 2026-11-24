
from sqlalchemy import Column, String
from sqlmodel import Field, SQLModel


class Categoria(SQLModel, table=True):
    __tablename__ = "categorias"

    id: int | None = Field(
        default=None,
        primary_key=True,
    )

    nombre: str = Field(
        sa_column=Column(
            String(100),
            unique=True,
            index=True,
            nullable=False,
        )
    )

    descripcion: str | None = Field(
        default=None,
        sa_column=Column(
            String(255),
            nullable=True,
        )
    )

    activo: bool = Field(
        default=True,
        nullable=False,
    )
