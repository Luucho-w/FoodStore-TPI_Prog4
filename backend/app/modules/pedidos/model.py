
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import (
    CheckConstraint,
    Column,
    DateTime,
    Numeric,
    String,
    Text,
)
from sqlmodel import Field, SQLModel


def fecha_actual():
    return datetime.now(timezone.utc)


class Pedido(SQLModel, table=True):
    __tablename__ = "pedidos"

    __table_args__ = (
        CheckConstraint(
            "total >= 0",
            name="ck_pedidos_total_no_negativo",
        ),
        CheckConstraint(
            "estado IN ('PENDIENTE', 'EN_PREPARACION', 'ENTREGADO', 'CANCELADO')",
            name="ck_pedidos_estado_valido",
        ),
        CheckConstraint(
            "forma_pago IN ('EFECTIVO', 'TRANSFERENCIA')",
            name="ck_pedidos_forma_pago_valida",
        ),
    )

    id: int | None = Field(default=None, primary_key=True)

    usuario_id: int = Field(
        foreign_key="usuario.id",
        nullable=False,
        index=True,
    )

    estado: str = Field(
        default="PENDIENTE",
        sa_column=Column(String(30), nullable=False),
    )

    forma_pago: str = Field(
        sa_column=Column(String(30), nullable=False),
    )

    direccion_entrega: str = Field(
        min_length=5,
        max_length=200,
        sa_column=Column(String(200), nullable=False),
    )

    notas: str | None = Field(
        default=None,
        sa_column=Column(Text, nullable=True),
    )

    total: Decimal = Field(
        sa_column=Column(Numeric(12, 2), nullable=False),
    )

    created_at: datetime = Field(
        default_factory=fecha_actual,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    updated_at: datetime = Field(
        default_factory=fecha_actual,
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            onupdate=fecha_actual,
        ),
    )


class DetallePedido(SQLModel, table=True):
    __tablename__ = "detalles_pedido"

    __table_args__ = (
        CheckConstraint(
            "cantidad >= 1",
            name="ck_detalles_cantidad_minima",
        ),
        CheckConstraint(
            "precio_unitario >= 0",
            name="ck_detalles_precio_no_negativo",
        ),
        CheckConstraint(
            "subtotal >= 0",
            name="ck_detalles_subtotal_no_negativo",
        ),
    )

    id: int | None = Field(default=None, primary_key=True)

    pedido_id: int = Field(
        foreign_key="pedidos.id",
        nullable=False,
        index=True,
    )

    producto_id: int = Field(
        foreign_key="productos.id",
        nullable=False,
        index=True,
    )

    cantidad: int = Field(ge=1, nullable=False)

    nombre_producto: str = Field(
        sa_column=Column(String(150), nullable=False),
    )

    precio_unitario: Decimal = Field(
        sa_column=Column(Numeric(12, 2), nullable=False),
    )

    subtotal: Decimal = Field(
        sa_column=Column(Numeric(12, 2), nullable=False),
    )
