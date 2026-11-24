
from fastapi import APIRouter, Depends, Response, status

from app.core.security import require_role
from app.core.unit_of_work import UnitOfWork
from app.modules.usuarios.model import Usuario
from app.modules.categoria.schema import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaUpdate,
)
from app.modules.categoria.service import CategoriaService


router = APIRouter(
    prefix="/categorias",
    tags=["Categorías"],
)


def obtener_categoria_service() -> CategoriaService:
    return CategoriaService(UnitOfWork())


@router.get(
    "/",
    response_model=list[CategoriaRead],
)
def listar_categorias(
    service: CategoriaService = Depends(obtener_categoria_service),
):
    return service.obtener_todas()


@router.get(
    "/{categoria_id}",
    response_model=CategoriaRead,
)
def obtener_categoria(
    categoria_id: int,
    service: CategoriaService = Depends(obtener_categoria_service),
):
    return service.obtener_por_id(categoria_id)


@router.post(
    "/",
    response_model=CategoriaRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_categoria(
    datos: CategoriaCreate,
    administrador: Usuario = Depends(require_role("admin")),
    service: CategoriaService = Depends(obtener_categoria_service),
):
    return service.crear(datos)


@router.put(
    "/{categoria_id}",
    response_model=CategoriaRead,
)
def actualizar_categoria(
    categoria_id: int,
    datos: CategoriaUpdate,
    administrador: Usuario = Depends(require_role("admin")),
    service: CategoriaService = Depends(obtener_categoria_service),
):
    return service.actualizar(categoria_id, datos)


@router.delete(
    "/{categoria_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def desactivar_categoria(
    categoria_id: int,
    administrador: Usuario = Depends(require_role("admin")),
    service: CategoriaService = Depends(obtener_categoria_service),
):
    service.desactivar(categoria_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
