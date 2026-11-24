
import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import type { Ingrediente } from '../types/ingrediente'
import type { IngredienteCreate } from '../types/ingrediente'

interface IngredienteModalProps {
  abierto: boolean
  ingrediente: Ingrediente | null
  onCerrar: () => void
  onGuardar: (datos: IngredienteCreate) => void
}

function IngredienteModal({
  abierto,
  ingrediente,
  onCerrar,
  onGuardar,
}: IngredienteModalProps) {
  const form = useForm({
    defaultValues: {
      nombre: '',
    },
    onSubmit: async ({ value }) => {
      onGuardar({
        nombre: value.nombre.trim(),
      })
    },
  })

  useEffect(() => {
    form.reset()
    form.setFieldValue('nombre', ingrediente?.nombre ?? '')
  }, [ingrediente, abierto])

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-slate-800">
          {ingrediente ? 'Editar ingrediente' : 'Nuevo ingrediente'}
        </h2>

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
              onChange: ({ value }) =>
                value.trim().length === 0
                  ? 'El nombre es obligatorio'
                  : undefined,
            }}
          >
            {(field) => (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nombre
                </label>

                <input
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-500"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej: Harina"
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCerrar}
              className="rounded-lg border border-slate-300 px-4 py-2"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default IngredienteModal
