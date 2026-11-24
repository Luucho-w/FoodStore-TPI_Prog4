
import api from '@/shared/api/api'

export interface UsuarioAdmin {
  id: number
  username: string
  full_name: string
  email: string
  role: 'user' | 'admin'
  disabled: boolean
  created_at: string
}

export async function obtenerUsuarios(): Promise<UsuarioAdmin[]> {
  const response = await api.get<UsuarioAdmin[]>('/api/v1/usuarios/')

  return response.data
}

export async function desactivarUsuario(
  usuarioId: number,
): Promise<void> {
  await api.patch(`/api/v1/usuarios/${usuarioId}/desactivar`)
}