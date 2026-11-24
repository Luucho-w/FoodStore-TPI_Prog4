
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from .model import Producto


class ProductoRepository(BaseRepository[Producto]):

    def __init__(self, session: Session):
        super().__init__(session, Producto)

    def obtener_todas(
        self,
        solo_activos: bool = False,
        skip: int = 0,
        limit: int = 10,
        busqueda: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> tuple[int, list[Producto]]:

        consulta = select(Producto)

        if solo_activos:
            consulta = consulta.where(Producto.activo.is_(True))

        if busqueda:
            consulta = consulta.where(
                Producto.nombre.ilike(f"%{busqueda}%")
            )

        if categoria_id is not None:
            consulta = consulta.where(
                Producto.categoria_id == categoria_id
            )

        if disponible is not None:
            consulta = consulta.where(
                Producto.disponible == disponible
            )

        total = len(self.session.exec(consulta).all())

        productos = self.session.exec(
            consulta
            .order_by(Producto.nombre)
            .offset(skip)
            .limit(limit)
        ).all()

        return total, list(productos)
