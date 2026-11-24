
from datetime import datetime, time, timezone

from sqlalchemy import func
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from .model import Pedido, DetallePedido


class PedidoRepository(BaseRepository[Pedido]):

    def __init__(self, session: Session):
        super().__init__(session, Pedido)

    def obtener_todos(
        self,
        usuario_id: int | None = None,
        estado: str | None = None,
        skip: int = 0,
        limit: int = 10,
    ) -> tuple[int, list[Pedido]]:

        consulta = select(Pedido)

        if usuario_id is not None:
            consulta = consulta.where(
                Pedido.usuario_id == usuario_id
            )

        if estado is not None:
            consulta = consulta.where(
                Pedido.estado == estado
            )

        total = len(self.session.exec(consulta).all())

        pedidos = self.session.exec(
            consulta
            .order_by(Pedido.created_at.desc())
            .offset(skip)
            .limit(limit)
        ).all()

        return total, list(pedidos)

    def obtener_detalles(self, pedido_id: int) -> list[DetallePedido]:
        consulta = select(DetallePedido).where(
            DetallePedido.pedido_id == pedido_id
        )
        return list(self.session.exec(consulta).all())

    def agregar_detalle(self, detalle: DetallePedido) -> DetallePedido:
        self.session.add(detalle)
        self.session.flush()
        self.session.refresh(detalle)
        return detalle

    def obtener_resumen(self) -> dict:
        hoy = datetime.now(timezone.utc).date()

        inicio_dia = datetime.combine(
            hoy, time.min, tzinfo=timezone.utc
        )
        fin_dia = datetime.combine(
            hoy, time.max, tzinfo=timezone.utc
        )

        pendientes = self.session.exec(
            select(func.count(Pedido.id)).where(
                Pedido.estado == "PENDIENTE"
            )
        ).one()

        en_preparacion = self.session.exec(
            select(func.count(Pedido.id)).where(
                Pedido.estado == "EN_PREPARACION"
            )
        ).one()

        entregados = self.session.exec(
            select(func.count(Pedido.id)).where(
                Pedido.estado == "ENTREGADO"
            )
        ).one()

        cancelados = self.session.exec(
            select(func.count(Pedido.id)).where(
                Pedido.estado == "CANCELADO"
            )
        ).one()

        pedidos_hoy = self.session.exec(
            select(func.count(Pedido.id)).where(
                Pedido.created_at >= inicio_dia,
                Pedido.created_at <= fin_dia,
            )
        ).one()

        total_vendido = self.session.exec(
            select(func.sum(Pedido.total)).where(
                Pedido.estado == "ENTREGADO"
            )
        ).one()

        return {
            "pendientes": pendientes,
            "en_preparacion": en_preparacion,
            "entregados": entregados,
            "cancelados": cancelados,
            "pedidos_hoy": pedidos_hoy,
            "total_vendido": total_vendido or 0,
        }
