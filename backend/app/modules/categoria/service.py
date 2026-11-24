
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.core.unit_of_work import UnitOfWork
from app.modules.categoria.model import Categoria
from app.modules.categoria.schema import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaUpdate,
)


class CategoriaService:

    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def obtener_todas(self) -> list[CategoriaRead]:
        with self.uow as uow:
            categorias = uow.categorias.obtener_todas(solo_activas=True)

            return [
                CategoriaRead.model_validate(categoria)
                for categoria in categorias
            ]

    def obtener_por_id(self, categoria_id: int) -> CategoriaRead:
        with self.uow as uow:
            categoria = uow.categorias.obtener_por_id(categoria_id)

            if not categoria or not categoria.activo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Categoría no encontrada",
                )

            return CategoriaRead.model_validate(categoria)

    def crear(self, datos: CategoriaCreate) -> CategoriaRead:
        nombre = datos.nombre.strip()

        with self.uow as uow:
            existente = uow.categorias.obtener_por_nombre(nombre)

            if existente:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Ya existe una categoría con ese nombre",
                )

            categoria = Categoria(
                nombre=nombre,
                descripcion=datos.descripcion,
            )

            try:
                uow.categorias.agregar(categoria)
                uow.session.flush()

            except IntegrityError:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Ya existe una categoría con ese nombre",
                )

            return CategoriaRead.model_validate(categoria)

    def actualizar(
        self,
        categoria_id: int,
        datos: CategoriaUpdate,
    ) -> CategoriaRead:
        with self.uow as uow:
            categoria = uow.categorias.obtener_por_id(categoria_id)

            if not categoria or not categoria.activo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Categoría no encontrada",
                )

            cambios = datos.model_dump(exclude_unset=True)

            if "nombre" in cambios and cambios["nombre"] is not None:
                nombre = cambios["nombre"].strip()
                existente = uow.categorias.obtener_por_nombre(nombre)

                if existente and existente.id != categoria_id:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Ya existe una categoría con ese nombre",
                    )

                cambios["nombre"] = nombre

            for campo, valor in cambios.items():
                setattr(categoria, campo, valor)

            uow.session.add(categoria)
            uow.session.flush()

            return CategoriaRead.model_validate(categoria)

    def desactivar(self, categoria_id: int) -> None:
        with self.uow as uow:
            categoria = uow.categorias.obtener_por_id(categoria_id)

            if not categoria or not categoria.activo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Categoría no encontrada",
                )

            categoria.activo = False
            uow.session.add(categoria)
            uow.session.flush()
