
from sqlmodel import Session

from app.core.database import engine

from app.modules.usuarios.repository import UsuarioRepository
from app.modules.categoria.repository import CategoriaRepository
from app.modules.producto.repository import ProductoRepository
from app.modules.pedidos.repository import PedidoRepository


class UnitOfWork:

    def __enter__(self):
        self.session = Session(engine, expire_on_commit=False)

        self.usuarios = UsuarioRepository(self.session)
        self.categorias = CategoriaRepository(self.session)
        self.productos = ProductoRepository(self.session)
        self.pedidos = PedidoRepository(self.session)

        return self

    def __exit__(self, tipo_error, error, traceback):
        try:
            if tipo_error:
                self.session.rollback()
            else:
                self.session.commit()
        finally:
            self.session.close()

        return False
