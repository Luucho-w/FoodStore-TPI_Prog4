
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from .model import Categoria


class CategoriaRepository(BaseRepository[Categoria]):

    def __init__(self, session: Session):
        super().__init__(session, Categoria)

    def obtener_por_nombre(self, nombre: str) -> Categoria | None:
        consulta = select(Categoria).where(
            Categoria.nombre == nombre
        )
        return self.session.exec(consulta).first()

    def obtener_todas(self, solo_activas: bool = False) -> list[Categoria]:
        consulta = select(Categoria)

        if solo_activas:
            consulta = consulta.where(Categoria.activo.is_(True))

        consulta = consulta.order_by(Categoria.nombre)

        return list(self.session.exec(consulta).all())
