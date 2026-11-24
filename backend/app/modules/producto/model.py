
from decimal import Decimal

from sqlalchemy import CheckConstraint, Column, Numeric, String
from sqlmodel import Field, SQLModel


class Producto(SQLModel, table=True):
    __tablename__ = "productos"

    __table_args__ = (
        CheckConstraint(
            "precio_base >= 0",
            name="ck_productos_precio_no_negativo",
        ),
        CheckConstraint(
            "stock >= 0",
            name="ck_productos_stock_no_negativo",
        ),
    )

    id: int | None = Field(default=None, primary_key=True)

    categoria_id: int = Field(
        foreign_key="categorias.id",
        nullable=False,
        index=True,
    )

    nombre: str = Field(
        sa_column=Column(String(150), nullable=False)
    )

    descripcion: str | None = Field(
        default=None,
        sa_column=Column(String(500), nullable=True),
    )

    precio_base: Decimal = Field(
        ge=0,
        sa_column=Column(Numeric(12, 2), nullable=False),
    )

    imagen_url: str | None = Field(
        default=None,
        sa_column=Column(String(500), nullable=True),
    )

    stock: int = Field(default=0, ge=0, nullable=False)

    disponible: bool = Field(default=True, nullable=False)

    activo: bool = Field(default=True, nullable=False)
