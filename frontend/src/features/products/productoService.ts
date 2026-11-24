
import api from '@/shared/api/api'
import type { Producto } from './types/producto'

export interface ProductoCreate {
  categoria_id: number
  nombre: string
  descripcion?: string | null
  precio_base: string
  imagen_url?: string | null
  stock: number
  disponible: boolean
}

export interface ProductosPaginados {
  total: number
  items: Producto[]
}

export interface ProductoFiltros {
  skip?: number
  limit?: number
  busqueda?: string
  categoria_id?: number
  disponible?: boolean
}

export async function obtenerProductos(
  filtros: ProductoFiltros = {},
): Promise<ProductosPaginados> {
  const respuesta = await api.get<ProductosPaginados>(
    '/api/v1/productos/',
    { params: filtros },
  )

  return respuesta.data
}

export async function crearProducto(
  datos: ProductoCreate,
): Promise<Producto> {
  const respuesta = await api.post<Producto>(
    '/api/v1/productos/',
    datos,
  )

  return respuesta.data
}

export async function actualizarProducto(
  id: number,
  datos: ProductoCreate,
): Promise<Producto> {
  const respuesta = await api.put<Producto>(
    `/api/v1/productos/${id}`,
    datos,
  )

  return respuesta.data
}

export async function eliminarProducto(id: number): Promise<void> {
  await api.delete(`/api/v1/productos/${id}`)
}
