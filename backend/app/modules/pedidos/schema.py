
from datetime import datetime
from decimal import Decimal
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


FormaPago = Literal["EFECTIVO", "TRANSFERENCIA"]

EstadoPedido = Literal[
    "PENDIENTE",
    "EN_PREPARACION",
    "ENTREGADO",
    "CANCELADO",
]


class DetallePedidoCreate(BaseModel):
    producto_id: int = Field(gt=0)
    cantidad: int = Field(ge=1)



class PedidoCreate(BaseModel):
    forma_pago: FormaPago

    direccion_entrega: str = Field(
        min_length=5,
        max_length=200,
        strip_whitespace=True,
    )

    notas: Optional[str] = Field(
        default=None,
        max_length=1000,
        strip_whitespace=True,
    )

    detalles: list[DetallePedidoCreate] = Field(min_length=1)


class PedidoEstadoUpdate(BaseModel):
    estado: EstadoPedido



class DetallePedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    pedido_id: int
    producto_id: int
    cantidad: int
    nombre_producto: str
    precio_unitario: Decimal
    subtotal: Decimal


class PedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    usuario_id: int
    nombre_usuario: str
    estado: EstadoPedido
    forma_pago: FormaPago
    direccion_entrega: str
    notas: Optional[str]
    total: Decimal
    created_at: datetime
    updated_at: datetime
    detalles: list[DetallePedidoRead] = Field(default_factory=list)


class PedidosPaginados(BaseModel):
    total: int
    items: list[PedidoRead]


class PedidoResumen(BaseModel):
    pendientes: int
    en_preparacion: int
    entregados: int
    cancelados: int
    pedidos_hoy: int
    total_vendido: Decimal
