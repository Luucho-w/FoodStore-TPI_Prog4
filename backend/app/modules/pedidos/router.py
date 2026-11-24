
from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status

from app.core.security import obtener_usuario_activo, require_role
from app.core.unit_of_work import UnitOfWork
from app.modules.usuarios.model import Usuario

from .schema import (
    PedidoCreate,
    PedidoEstadoUpdate,
    PedidoRead,
    PedidoResumen,
    PedidosPaginados,
)
from .service import PedidoService


router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


def obtener_pedido_service() -> PedidoService:
    return PedidoService(UnitOfWork())


PedidoServiceDep = Annotated[
    PedidoService,
    Depends(obtener_pedido_service),
]

UsuarioActivo = Annotated[
    Usuario,
    Depends(obtener_usuario_activo),
]

Administrador = Annotated[
    Usuario,
    Depends(require_role("admin")),
]


@router.post(
    "/",
    response_model=PedidoRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_pedido(
    datos: PedidoCreate,
    usuario: UsuarioActivo,
    service: PedidoServiceDep,
):
    return service.crear_pedido(
        datos=datos,
        usuario_id=usuario.id,
    )


@router.get("/resumen", response_model=PedidoResumen)
def obtener_resumen(
    administrador: Administrador,
    service: PedidoServiceDep,
):
    return service.obtener_resumen()


@router.get("/", response_model=PedidosPaginados)
def listar_pedidos(
    usuario: UsuarioActivo,
    service: PedidoServiceDep,
    estado: str | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
):
    return service.listar_pedidos(
        usuario_id=usuario.id,
        es_admin=usuario.role == "admin",
        estado=estado,
        skip=skip,
        limit=limit,
    )


@router.get("/{pedido_id}", response_model=PedidoRead)
def obtener_pedido(
    pedido_id: int,
    usuario: UsuarioActivo,
    service: PedidoServiceDep,
):
    return service.obtener_pedido(
        pedido_id=pedido_id,
        usuario_id=usuario.id,
        es_admin=usuario.role == "admin",
    )


@router.patch(
    "/{pedido_id}/estado",
    response_model=PedidoRead,
)
def actualizar_estado(
    pedido_id: int,
    datos: PedidoEstadoUpdate,
    administrador: Administrador,
    service: PedidoServiceDep,
):
    return service.actualizar_estado(
        pedido_id=pedido_id,
        datos=datos,
        administrador_id=administrador.id,
    )


@router.patch(
    "/{pedido_id}/cancelar",
    response_model=PedidoRead,
)
def cancelar_pedido(
    pedido_id: int,
    usuario: UsuarioActivo,
    service: PedidoServiceDep,
):
    return service.cancelar_pedido(
        pedido_id=pedido_id,
        usuario_id=usuario.id,
    )
