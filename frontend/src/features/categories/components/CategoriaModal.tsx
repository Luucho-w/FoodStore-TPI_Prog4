
import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import type { Categoria, CategoriaCreate } from '../types/categoria'

interface CategoriaModalProps {
  abierto: boolean
  categoria: Categoria | null
  guardando: boolean
  onCerrar: () => void
  onSubmit: (datos: CategoriaCreate) => void
}

function CategoriaModal({
  abierto,
  categoria,
  guardando,
  onCerrar,
  onSubmit,
}: CategoriaModalProps) {
  const form = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim() || null,
      })
    },
  })

  useEffect(() => {
    if (abierto) {
      form.reset({
        nombre: categoria?.nombre ?? '',
        descripcion: categoria?.descripcion ?? '',
      })
    }
  }, [abierto, categoria])

  if (!abierto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !guardando) {
          onCerrar()
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="categoria-modal-titulo"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="categoria-modal-titulo"
              className="text-xl font-bold text-slate-900 dark:text-white"
            >
              {categoria ? 'Editar categoría' : 'Nueva categoría'}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Completá los datos de la categoría.
            </p>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            disabled={guardando}
            className="rounded-lg px-3 py-1 text-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-5"
        >
          <form.Field
            name="nombre"
            validators={{
              onChange: ({ value }) => {
                const nombre = value.trim()

                if (nombre.length < 2) {
                  return 'El nombre debe tener al menos 2 caracteres'
                }

                if (nombre.length > 100) {
                  return 'El nombre no puede superar los 100 caracteres'
                }

                return undefined
              },
            }}
          >
            {(field) => (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Nombre *
                </label>
                <input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  maxLength={100}
                  required
                  autoFocus
                  placeholder="Ej.: Electrónica"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error} className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field name="descripcion">
            {(field) => (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Descripción
                </label>
                <textarea
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  rows={4}
                  maxLength={255}
                  placeholder="Describí brevemente esta categoría..."
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50"
                />
              </div>
            )}
          </form.Field>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCerrar}
              disabled={guardando}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {guardando
                ? 'Guardando...'
                : categoria
                  ? 'Guardar cambios'
                  : 'Crear categoría'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default CategoriaModal
