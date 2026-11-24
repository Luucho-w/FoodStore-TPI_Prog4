
import { create } from 'zustand'

interface NotificationState {
  message: string
  type: 'success' | 'error'
  visible: boolean

  showNotification: (
    message: string,
    type?: 'success' | 'error',
  ) => void

  hideNotification: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: '',
  type: 'success',
  visible: false,

  showNotification: (message, type = 'success') =>
    set({
      message,
      type,
      visible: true,
    }),

  hideNotification: () =>
    set({
      visible: false,
    }),
}))
