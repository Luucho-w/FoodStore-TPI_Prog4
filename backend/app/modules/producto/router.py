
from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status

from app.core.security import require_role
from app.core.unit_of_work import UnitOfWork
from app.modules.usuarios.model import Usuario
from app.modules.producto.schema import (
    ProductoCreate,
    ProductoRead,
    ProductoUpdate,
    ProductoStockUpdate,
    ProductosPaginados,
)
from app.modules.producto.service import ProductoService


router = APIRouter(prefix="/productos", tags=["Productos"])


def obtener_producto_service():
    return ProductoService(UnitOfWork())


ProductoServiceDep = Annotated[
    ProductoService,
    Depends(obtener_producto_service),
]

Administrador = Annotated[
    Usuario,
    Depends(require_role("admin")),
]


@router.get("/", response_model=ProductosPaginados)
def listar_productos(
    service: ProductoServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    busqueda: str | None = Query(default=None),
    categoria_id: int | None = Query(default=None, gt=0),
    disponible: bool | None = Query(default=None),
):
    return service.obtener_todos(
        skip=skip,
        limit=limit,
        busqueda=busqueda,
        categoria_id=categoria_id,
        disponible=disponible,
    )


@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(
    producto_id: int,
    service: ProductoServiceDep,
):
    return service.obtener_por_id(producto_id)


@router.post(
    "/",
    response_model=ProductoRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_producto(
    datos: ProductoCreate,
    service: ProductoServiceDep,
    administrador: Administrador,
):
    return service.crear(datos)


@router.put("/{producto_id}", response_model=ProductoRead)
def actualizar_producto(
    producto_id: int,
    datos: ProductoUpdate,
    service: ProductoServiceDep,
    administrador: Administrador,
):
    return service.actualizar(producto_id, datos)


@router.patch(
    "/{producto_id}/stock",
    response_model=ProductoRead,
)
def actualizar_stock(
    producto_id: int,
    datos: ProductoStockUpdate,
    service: ProductoServiceDep,
    administrador: Administrador,
):
    return service.actualizar_stock(producto_id, datos)


@router.delete(
    "/{producto_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_producto(
    producto_id: int,
    service: ProductoServiceDep,
    administrador: Administrador,
):
    service.desactivar(producto_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
