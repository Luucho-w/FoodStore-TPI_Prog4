
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.core.unit_of_work import UnitOfWork
from app.modules.producto.model import Producto
from app.modules.producto.schema import (
    ProductoCreate,
    ProductoRead,
    ProductoUpdate,
    ProductoStockUpdate,
    ProductosPaginados,
)


class ProductoService:

    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def obtener_todos(
        self,
        skip: int = 0,
        limit: int = 10,
        busqueda: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> ProductosPaginados:

        with self.uow as uow:
            total, productos = uow.productos.obtener_todas(
                solo_activos=True,
                skip=skip,
                limit=limit,
                busqueda=busqueda,
                categoria_id=categoria_id,
                disponible=disponible,
            )

            return ProductosPaginados(
                total=total,
                items=[
                    ProductoRead.model_validate(producto)
                    for producto in productos
                ],
            )

    def obtener_por_id(self, producto_id: int) -> ProductoRead:

        with self.uow as uow:
            producto = uow.productos.obtener_por_id(producto_id)

            if not producto or not producto.activo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Producto no encontrado",
                )

            return ProductoRead.model_validate(producto)

    def crear(self, datos: ProductoCreate) -> ProductoRead:

        with self.uow as uow:
            categoria = uow.categorias.obtener_por_id(
                datos.categoria_id
            )

            if not categoria or not categoria.activo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Categoría no encontrada o inactiva",
                )

            producto = Producto(
                **datos.model_dump()
            )

            uow.productos.agregar(producto)

            return ProductoRead.model_validate(producto)

    def actualizar(
        self,
        producto_id: int,
        datos: ProductoUpdate,
    ) -> ProductoRead:

        with self.uow as uow:
            producto = uow.productos.obtener_por_id(producto_id)

            if not producto or not producto.activo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Producto no encontrado",
                )

            cambios = datos.model_dump(exclude_unset=True)

            if "categoria_id" in cambios:
                categoria = uow.categorias.obtener_por_id(
                    cambios["categoria_id"]
                )

                if not categoria or not categoria.activo:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Categoría no encontrada o inactiva",
                    )

            for campo, valor in cambios.items():
                setattr(producto, campo, valor)

            uow.session.add(producto)
            uow.session.flush()

            return ProductoRead.model_validate(producto)

    def actualizar_stock(
        self,
        producto_id: int,
        datos: ProductoStockUpdate,
    ) -> ProductoRead:

        with self.uow as uow:
            producto = uow.productos.obtener_por_id(producto_id)

            if not producto or not producto.activo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Producto no encontrado",
                )

            producto.stock = datos.stock
            producto.disponible = datos.stock > 0

            uow.session.add(producto)
            uow.session.flush()

            return ProductoRead.model_validate(producto)

    def desactivar(self, producto_id: int) -> None:

        with self.uow as uow:
            producto = uow.productos.obtener_por_id(producto_id)

            if not producto or not producto.activo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Producto no encontrado",
                )

            producto.activo = False

            uow.session.add(producto)
            uow.session.flush()
