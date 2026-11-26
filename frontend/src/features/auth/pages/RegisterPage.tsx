
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useForm } from '@tanstack/react-form'
import { useAuth } from '../hooks/useAuth'
import type { UsuarioRegistro } from '../authService'
import { useNotificationStore } from '@/store/notificationStore'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  )
  const [enviando, setEnviando] = useState(false)

  const form = useForm({
    defaultValues: {
      username: '',
      full_name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const datos: UsuarioRegistro = {
        username: value.username.trim(),
        full_name: value.full_name.trim(),
        email: value.email.trim(),
        password: value.password,
      }

      setEnviando(true)

      try {
        await register(datos)
        showNotification('Usuario registrado correctamente')
        navigate('/login')
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const detalle = err.response?.data?.detail

          showNotification(
            typeof detalle === 'string'
              ? detalle
              : 'No se pudo completar el registro. Revisá los datos.',
            'error',
          )
        } else {
          showNotification('Ocurrió un error inesperado.', 'error')
        }
      } finally {
        setEnviando(false)
      }
    },
  })

  return (
    <section className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
      <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
        Crear cuenta
      </h1>

      <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
        Completá tus datos para registrarte.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <form.Field name="username">
          {(field) => (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Nombre de usuario
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
                minLength={3}
                maxLength={50}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="full_name">
          {(field) => (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Nombre completo
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
                maxLength={150}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Correo electrónico
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
              />
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Contraseña
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
                minLength={8}
                maxLength={128}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Debe tener al menos 8 caracteres.
              </p>
            </div>
          )}
        </form.Field>

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {enviando ? 'Registrando...' : 'Registrarme'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        ¿Ya tenés una cuenta?{' '}
        <Link
          to="/login"
          className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Iniciar sesión
        </Link>
      </p>
    </section>
  )
}

export default RegisterPage
