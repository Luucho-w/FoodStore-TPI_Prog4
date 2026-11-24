
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useNotificationStore } from '@/store/notificationStore'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)

  const { login } = useAuth()
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  )
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEnviando(true)

    try {
      await login(username, password)
      navigate('/productos', { replace: true })
    } catch {
      showNotification('Usuario o contraseña incorrectos.', 'error')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-2xl font-bold text-slate-800">
        Iniciar sesión
      </h1>

      <p className="mb-6 text-sm text-slate-500">
        Ingresá tus credenciales para continuar.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Nombre de usuario
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Contraseña
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        ¿No tenés una cuenta?{' '}
        <Link
          to="/register"
          className="font-semibold text-indigo-600 hover:underline"
        >
          Registrate
        </Link>
      </p>
    </div>
  )
}

export default LoginPage
