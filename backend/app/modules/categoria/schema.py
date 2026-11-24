
from sqlmodel import SQLModel, Field


class CategoriaBase(SQLModel):
    nombre: str = Field(min_length=2, max_length=100)
    descripcion: str | None = Field(default=None, max_length=255)


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(SQLModel):
    nombre: str | None = Field(default=None, min_length=2, max_length=100)
    descripcion: str | None = Field(default=None, max_length=255)


class CategoriaRead(CategoriaBase):
    id: int
    activo: bool
