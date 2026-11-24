
import { useEffect } from 'react'
import AppRouter from '@/routes/AppRouter'
import Toast from '@/shared/components/Toast'
import { useAuthStore } from '@/features/auth'

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <>
      <AppRouter />
      <Toast />
    </>
  )
}

export default App
