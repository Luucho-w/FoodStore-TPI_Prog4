
export interface Producto {
  id: number
  categoria_id: number
  nombre: string
  descripcion: string | null
  precio_base: string
  imagen_url: string | null
  stock: number
  disponible: boolean
  activo: boolean
}
