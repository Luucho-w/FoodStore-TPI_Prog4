
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP

from fastapi import HTTPException, status

from app.core.unit_of_work import UnitOfWork
from app.modules.pedidos.model import Pedido, DetallePedido
from app.modules.pedidos.schema import (
    DetallePedidoRead,
    PedidoCreate,
    PedidoEstadoUpdate,
    PedidoRead,
    PedidoResumen,
    PedidosPaginados,
)


CENTAVOS = Decimal("0.01")


def convertir_a_decimal(valor) -> Decimal:
    return Decimal(str(valor)).quantize(
        CENTAVOS,
        rounding=ROUND_HALF_UP,
    )


class PedidoService:

    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def _convertir_a_read(self, uow, pedido):
        detalles = uow.pedidos.obtener_detalles(pedido.id)

        usuario = uow.usuarios.obtener_por_id(pedido.usuario_id)

        return PedidoRead(
            **{
                **pedido.model_dump(),
                "nombre_usuario": (
                    usuario.full_name if usuario else "Usuario desconocido"
                ),
                "detalles": [
                    DetallePedidoRead.model_validate(detalle)
                    for detalle in detalles
                ],
            }
        )

    def crear_pedido(
        self,
        datos: PedidoCreate,
        usuario_id: int,
    ) -> PedidoRead:

        productos_ids = [
            detalle.producto_id
            for detalle in datos.detalles
        ]

        if len(productos_ids) != len(set(productos_ids)):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="No se permiten productos repetidos en un pedido",
            )

        with self.uow as uow:

            detalles_a_crear = []
            total = Decimal("0.00")

            for detalle_data in datos.detalles:

                producto = uow.productos.obtener_por_id(
                    detalle_data.producto_id
                )

                if producto is None or not producto.activo:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Producto {detalle_data.producto_id} no encontrado",
                    )

                if not producto.disponible:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"El producto {producto.nombre} no está disponible",
                    )

                if producto.stock < detalle_data.cantidad:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Stock insuficiente para {producto.nombre}",
                    )

                precio = convertir_a_decimal(producto.precio_base)

                subtotal = convertir_a_decimal(
                    precio * detalle_data.cantidad
                )

                total += subtotal

                detalles_a_crear.append({
                    "producto": producto,
                    "cantidad": detalle_data.cantidad,
                    "precio": precio,
                    "subtotal": subtotal,
                })

                # Descontar stock
                producto.stock -= detalle_data.cantidad

                if producto.stock == 0:
                    producto.disponible = False

                uow.session.add(producto)

            total = convertir_a_decimal(total)

            pedido = Pedido(
                usuario_id=usuario_id,
                estado="PENDIENTE",
                forma_pago=datos.forma_pago,
                direccion_entrega=datos.direccion_entrega.strip(),
                notas=datos.notas,
                total=total,
            )

            uow.pedidos.agregar(pedido)

            for detalle_data in detalles_a_crear:

                producto = detalle_data["producto"]

                detalle = DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=producto.id,
                    cantidad=detalle_data["cantidad"],
                    nombre_producto=producto.nombre,
                    precio_unitario=detalle_data["precio"],
                    subtotal=detalle_data["subtotal"],
                )

                uow.pedidos.agregar_detalle(detalle)

            return self._convertir_a_read(uow, pedido)

    def listar_pedidos(
        self,
        usuario_id: int,
        es_admin: bool,
        estado: str | None = None,
        skip: int = 0,
        limit: int = 10,
    ) -> PedidosPaginados:

        with self.uow as uow:

            filtro_usuario = None if es_admin else usuario_id

            total, pedidos = uow.pedidos.obtener_todos(
                usuario_id=filtro_usuario,
                estado=estado,
                skip=skip,
                limit=limit,
            )

            return PedidosPaginados(
                total=total,
                items=[
                    self._convertir_a_read(uow, pedido)
                    for pedido in pedidos
                ],
            )

    def obtener_pedido(
        self,
        pedido_id: int,
        usuario_id: int,
        es_admin: bool,
    ) -> PedidoRead:

        with self.uow as uow:

            pedido = uow.pedidos.obtener_por_id(pedido_id)

            if pedido is None:
                raise HTTPException(404, "Pedido no encontrado")

            if not es_admin and pedido.usuario_id != usuario_id:
                raise HTTPException(403, "No tenés permiso para consultar este pedido")

            return self._convertir_a_read(uow, pedido)

    def _restaurar_stock(self, uow, pedido):

        detalles = uow.pedidos.obtener_detalles(pedido.id)

        for detalle in detalles:

            producto = uow.productos.obtener_por_id(
                detalle.producto_id
            )

            if producto is not None:
                producto.stock += detalle.cantidad
                producto.disponible = True
                uow.session.add(producto)

    def actualizar_estado(
        self,
        pedido_id: int,
        datos: PedidoEstadoUpdate,
        administrador_id: int,
    ) -> PedidoRead:

        with self.uow as uow:

            pedido = uow.pedidos.obtener_por_id(pedido_id)

            if pedido is None:
                raise HTTPException(404, "Pedido no encontrado")

            transiciones = {
                "PENDIENTE": ["EN_PREPARACION", "CANCELADO"],
                "EN_PREPARACION": ["ENTREGADO", "CANCELADO"],
            }

            estados_permitidos = transiciones.get(pedido.estado, [])

            if datos.estado not in estados_permitidos:
                raise HTTPException(
                    status_code=400,
                    detail=f"No se puede cambiar de {pedido.estado} a {datos.estado}",
                )

            if datos.estado == "CANCELADO":
                self._restaurar_stock(uow, pedido)

            pedido.estado = datos.estado
            pedido.updated_at = datetime.now(timezone.utc)

            uow.session.add(pedido)
            uow.session.flush()

            return self._convertir_a_read(uow, pedido)

    def cancelar_pedido(
        self,
        pedido_id: int,
        usuario_id: int,
    ) -> PedidoRead:

        with self.uow as uow:

            pedido = uow.pedidos.obtener_por_id(pedido_id)

            if pedido is None:
                raise HTTPException(404, "Pedido no encontrado")

            if pedido.usuario_id != usuario_id:
                raise HTTPException(
                    status_code=403,
                    detail="No tenés permiso para cancelar este pedido",
                )

            if pedido.estado != "PENDIENTE":
                raise HTTPException(
                    status_code=400,
                    detail="Solo se pueden cancelar pedidos pendientes",
                )

            self._restaurar_stock(uow, pedido)

            pedido.estado = "CANCELADO"
            pedido.updated_at = datetime.now(timezone.utc)

            uow.session.add(pedido)
            uow.session.flush()

            return self._convertir_a_read(uow, pedido)

    def obtener_resumen(self) -> PedidoResumen:

        with self.uow as uow:
            datos = uow.pedidos.obtener_resumen()

            return PedidoResumen(
                pendientes=datos["pendientes"],
                en_preparacion=datos["en_preparacion"],
                entregados=datos["entregados"],
                cancelados=datos["cancelados"],
                pedidos_hoy=datos["pedidos_hoy"],
                total_vendido=datos["total_vendido"],
            )
