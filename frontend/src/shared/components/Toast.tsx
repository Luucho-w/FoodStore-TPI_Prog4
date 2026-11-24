
import { useEffect } from 'react'
import { useNotificationStore } from '@/store/notificationStore'

function Toast() {
  const message = useNotificationStore((state) => state.message)
  const type = useNotificationStore((state) => state.type)
  const visible = useNotificationStore((state) => state.visible)
  const hideNotification = useNotificationStore(
    (state) => state.hideNotification,
  )

  useEffect(() => {
    if (!visible) return

    const timeout = setTimeout(() => {
      hideNotification()
    }, 3000)

    return () => clearTimeout(timeout)
  }, [visible, message, hideNotification])

  if (!visible) return null

  return (
    <div
      className={`fixed right-5 top-5 z-50 rounded-lg px-5 py-3 text-white shadow-lg ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}
      role="alert"
    >
      {message}
    </div>
  )
}

export default Toast
