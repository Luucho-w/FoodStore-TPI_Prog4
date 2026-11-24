
import api from './api'
import { useAuthStore } from '@/features/auth'
import { useNotificationStore } from '@/store/notificationStore'

export const setupInterceptors = () => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const url = error.config?.url ?? ''
      const status = error.response?.status

      const esLogin = url.includes('/auth/token')
      const esMe = url.includes('/auth/me')

      if (status === 401 && !esLogin && !esMe) {
        useAuthStore.getState().clearAuth()
      }

      if (status === 403) {
        useNotificationStore
          .getState()
          .showNotification('Acceso denegado', 'error')
      }

      return Promise.reject(error)
    },
  )
}
