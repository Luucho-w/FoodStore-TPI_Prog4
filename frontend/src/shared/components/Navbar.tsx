
import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/features/auth'
import { useThemeStore } from '@/store/themeStore'

function Navbar() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const darkMode = useThemeStore((state) => state.darkMode)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  const navigate = useNavigate()

  const esAdmin = user?.role === 'admin'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800'
    }`

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <NavLink
          to="/"
          end
          className="text-xl font-bold tracking-tight text-indigo-700 dark:text-indigo-400"
        >
          FoodStore
        </NavLink>

        <div className="flex flex-wrap items-center gap-2">
          <NavLink to="/" end className={linkClass}>
            Catálogo
          </NavLink>

          <NavLink to="/carrito" className={linkClass}>
            Carrito
          </NavLink>

          {user && (
            <>
              {!esAdmin && (
                <NavLink to="/mis-pedidos" className={linkClass}>
                  Mis pedidos
                </NavLink>
              )}

              {esAdmin && (
                <>
                  <NavLink to="/admin/resumen" className={linkClass}>
                    Resumen
                  </NavLink>

                  <NavLink to="/admin/categorias" className={linkClass}>
                    Categorías
                  </NavLink>

                  <NavLink to="/admin/productos" className={linkClass}>
                    Productos
                  </NavLink>

                  <NavLink to="/admin/pedidos" className={linkClass}>
                    Pedidos
                  </NavLink>

                  <NavLink to="/admin/usuarios" className={linkClass}>
                    Usuarios
                  </NavLink>
                </>
              )}

              <span className="px-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                {user.full_name} ({esAdmin ? 'Administrador' : 'Cliente'})
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
              >
                Cerrar sesión
              </button>
            </>
          )}

          {!user && (
            <>
              <NavLink to="/login" className={linkClass}>
                Iniciar sesión
              </NavLink>

              <NavLink to="/register" className={linkClass}>
                Registrarse
              </NavLink>
            </>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            {darkMode ? '☀️ Modo claro' : '🌙 Modo oscuro'}
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
