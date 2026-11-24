
import { useAuthStore } from '../store/authStore'
import { registrarUsuario } from '../authService'
import type { UsuarioRegistro } from '../authService'
import { useNotificationStore } from '@/store/notificationStore'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const checking = useAuthStore((state) => state.checking)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const checkAuth = useAuthStore((state) => state.checkAuth)

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  )

  const iniciarSesion = async (username: string, password: string) => {
    await login(username, password)
    showNotification('Sesión iniciada correctamente')
  }

  const cerrarSesion = async () => {
    await logout()
    showNotification('Sesión cerrada correctamente')
  }

  const register = async (datos: UsuarioRegistro) => {
    await registrarUsuario(datos)
  }

  return {
    user,
    checking,
    login: iniciarSesion,
    logout: cerrarSesion,
    checkAuth,
    register,
  }
}
