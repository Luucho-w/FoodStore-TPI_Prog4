
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'

function UnauthorizedPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mb-4 text-5xl font-bold text-red-500">
        403
      </div>

      <h1 className="mb-2 text-2xl font-bold text-slate-800">
        Acceso denegado
      </h1>

      <p className="mb-6 text-slate-600">
        Hola {user?.full_name}, no tenés permisos para acceder a esta sección.
      </p>

      <Link
        to="/productos"
        className="inline-block rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        Volver a productos
      </Link>
    </div>
  )
}

export default UnauthorizedPage
