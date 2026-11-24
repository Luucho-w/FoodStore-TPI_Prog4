
from sqlmodel import SQLModel, create_engine

from app.core.config import settings


engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
)


def crear_tablas() -> None:
    SQLModel.metadata.create_all(engine)
