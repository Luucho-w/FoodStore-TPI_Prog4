
import api from '@/shared/api/api'
import type { Ingrediente, IngredienteCreate } from './types/ingrediente'

export async function obtenerIngredientes(): Promise<Ingrediente[]> {
  const respuesta = await api.get<Ingrediente[]>('/ingredientes/')
  return respuesta.data
}

export async function crearIngrediente(
  datos: IngredienteCreate,
): Promise<Ingrediente> {
  const respuesta = await api.post<Ingrediente>(
    '/ingredientes/',
    datos,
  )
  return respuesta.data
}

export async function actualizarIngrediente(
  id: number,
  datos: IngredienteCreate,
): Promise<Ingrediente> {
  const respuesta = await api.put<Ingrediente>(
    `/ingredientes/${id}`,
    datos,
  )
  return respuesta.data
}

export async function eliminarIngrediente(id: number): Promise<void> {
  await api.delete(`/ingredientes/${id}`)
}
