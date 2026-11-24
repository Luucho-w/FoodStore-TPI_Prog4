
import api from '@/shared/api/api'

export interface UsuarioRegistro {
  username: string
  full_name: string
  email: string
  password: string
}

export async function registrarUsuario(
  datos: UsuarioRegistro,
): Promise<void> {
  await api.post('/api/v1/auth/register', datos)
}
