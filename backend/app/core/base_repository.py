
from typing import Generic, TypeVar

from sqlmodel import Session, SQLModel, select


ModelType = TypeVar("ModelType", bound=SQLModel)


class BaseRepository(Generic[ModelType]):

    def __init__(self, session: Session, model: type[ModelType]):
        self.session = session
        self.model = model

    def obtener_por_id(self, id: int) -> ModelType | None:
        return self.session.get(self.model, id)

    def obtener_todos(self) -> list[ModelType]:
        consulta = select(self.model)
        return list(self.session.exec(consulta).all())

    def agregar(self, entidad: ModelType) -> ModelType:
        self.session.add(entidad)
        self.session.flush()
        self.session.refresh(entidad)
        return entidad

    def eliminar(self, entidad: ModelType) -> None:
        self.session.delete(entidad)
        self.session.flush()
