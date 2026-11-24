
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'

interface ProtectedRouteProps {
  allowedRoles?: string[]
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user)
  const checking = useAuthStore((state) => state.checking)

  if (checking) {
    return (
      <div className="py-10 text-center text-slate-600">
        Verificando sesión...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
