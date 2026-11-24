
from sqlmodel import Session

from app.core.database import engine

from .repository import (
    FormaPagoRepository,
    EstadoPedidoRepository,
    DireccionEntregaRepository,
    PedidoRepository,
    DetallePedidoRepository,
    HistorialEstadoPedidoRepository,
    ProductoRepository,
)


class UnitOfWork:

    def __enter__(self):
        self.session = Session(engine)

        self.formas_pago = FormaPagoRepository(self.session)
        self.estados_pedido = EstadoPedidoRepository(self.session)
        self.direcciones = DireccionEntregaRepository(self.session)
        self.pedidos = PedidoRepository(self.session)
        self.detalles = DetallePedidoRepository(self.session)
        self.historial = HistorialEstadoPedidoRepository(self.session)
        self.productos = ProductoRepository(self.session)

        return self

    def __exit__(self, tipo_error, error, traceback):
        try:
            if tipo_error is not None:
                self.session.rollback()
            else:
                self.session.commit()
        finally:
            self.session.close()

        return False
