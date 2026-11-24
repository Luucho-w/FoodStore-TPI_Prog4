
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from .model import Usuario


class UsuarioRepository(BaseRepository[Usuario]):

    def __init__(self, session: Session):
        super().__init__(session, Usuario)

    def obtener_por_username(self, username: str) -> Usuario | None:
        consulta = select(Usuario).where(
            Usuario.username == username
        )
        return self.session.exec(consulta).first()

    def obtener_por_email(self, email: str) -> Usuario | None:
        consulta = select(Usuario).where(
            Usuario.email == email
        )
        return self.session.exec(consulta).first()

    def obtener_todos(self) -> list[Usuario]:
        consulta = select(Usuario).order_by(Usuario.id)
        return list(self.session.exec(consulta).all())
