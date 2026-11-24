
import api from '@/shared/api/api'
import type { Categoria, CategoriaCreate } from './types/categoria'

export async function obtenerCategorias(): Promise<Categoria[]> {
  const response = await api.get<Categoria[]>('/api/v1/categorias')
  return response.data
}

export async function obtenerCategoria(id: number): Promise<Categoria> {
  const response = await api.get<Categoria>(`/api/v1/categorias/${id}`)
  return response.data
}

export async function crearCategoria(
  datos: CategoriaCreate,
): Promise<Categoria> {
  const response = await api.post<Categoria>('/api/v1/categorias', datos)
  return response.data
}

export async function actualizarCategoria(
  id: number,
  datos: CategoriaCreate,
): Promise<Categoria> {
  const response = await api.put<Categoria>(
    `/api/v1/categorias/${id}`,
    datos,
  )
  return response.data
}

export async function eliminarCategoria(id: number): Promise<void> {
  await api.delete(`/api/v1/categorias/${id}`)
}
