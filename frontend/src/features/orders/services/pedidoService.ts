
import api from '@/shared/api/api'

export type FormaPago = 'EFECTIVO' | 'TRANSFERENCIA'

export type EstadoPedido =
  | 'PENDIENTE'
  | 'EN_PREPARACION'
  | 'ENTREGADO'
  | 'CANCELADO'

export interface DetallePedidoCreate {
  producto_id: number
  cantidad: number
}

export interface PedidoCreate {
  forma_pago: FormaPago
  direccion_entrega: string
  notas?: string | null
  detalles: DetallePedidoCreate[]
}

export interface DetallePedido {
  id: number
  pedido_id: number
  producto_id: number
  cantidad: number
  nombre_producto: string
  precio_unitario: string
  subtotal: string
}

export interface Pedido {
  id: number
  usuario_id: number
  nombre_usuario: string
  estado: EstadoPedido
  forma_pago: FormaPago
  direccion_entrega: string
  notas: string | null
  total: string
  created_at: string
  updated_at: string
  detalles: DetallePedido[]
}

export interface PedidosPaginados {
  total: number
  items: Pedido[]
}

export async function crearPedido(
  datos: PedidoCreate,
): Promise<Pedido> {
  const respuesta = await api.post<Pedido>(
    '/api/v1/pedidos/',
    datos,
  )

  return respuesta.data
}

export async function obtenerPedidos(
  skip = 0,
  limit = 10,
): Promise<PedidosPaginados> {
  const respuesta = await api.get<PedidosPaginados>(
    '/api/v1/pedidos/',
    { params: { skip, limit } },
  )

  return respuesta.data
}

export async function obtenerPedido(id: number): Promise<Pedido> {
  const respuesta = await api.get<Pedido>(
    `/api/v1/pedidos/${id}`,
  )

  return respuesta.data
}

export async function cancelarPedido(id: number): Promise<Pedido> {
  const respuesta = await api.patch<Pedido>(
    `/api/v1/pedidos/${id}/cancelar`,
  )

  return respuesta.data
}

export async function obtenerResumenPedidos(): Promise<{
  pendientes: number
  en_preparacion: number
  entregados: number
  cancelados: number
  pedidos_hoy: number
  total_vendido: string
}> {
  const respuesta = await api.get('/api/v1/pedidos/resumen')
  return respuesta.data
}

export async function actualizarEstadoPedido(
  id: number,
  estado: EstadoPedido,
): Promise<Pedido> {
  const respuesta = await api.patch<Pedido>(
    `/api/v1/pedidos/${id}/estado`,
    { estado },
  )
  return respuesta.data
}