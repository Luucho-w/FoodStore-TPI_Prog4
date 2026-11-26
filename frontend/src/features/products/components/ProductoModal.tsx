import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { useCategories } from '@/features/categories'
import type { Producto } from '../types/producto'
import type { ProductoCreate } from '../productoService'

interface ProductoModalProps {
  abierto: boolean
  producto: Producto | null
  onCerrar: () => void
  onGuardar: (datos: ProductoCreate) => void
}

function ProductoModal({
  abierto,
  producto,
  onCerrar,
  onGuardar,
}: ProductoModalProps) {
  const { categorias } = useCategories()

  const form = useForm({
    defaultValues: {
      categoria_id: 0,
      nombre: '',
      descripcion: '',
      precio_base: '',
      imagen_url: '',
      stock: 0,
      disponible: true,
    },
    onSubmit: async ({ value }) => {
      onGuardar({
        categoria_id: Number(value.categoria_id),
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim() || null,
        precio_base: value.precio_base.trim(),
        imagen_url: value.imagen_url.trim() || null,
        stock: Number(value.stock),
        disponible: value.disponible,
      })
    },
  })

  useEffect(() => {
    form.reset()
    form.setFieldValue('categoria_id', producto?.categoria_id ?? 0)
    form.setFieldValue('nombre', producto?.nombre ?? '')
    form.setFieldValue('descripcion', producto?.descripcion ?? '')
    form.setFieldValue('precio_base', producto?.precio_base ?? '')
    form.setFieldValue('imagen_url', producto?.imagen_url ?? '')
    form.setFieldValue('stock', producto?.stock ?? 0)
    form.setFieldValue('disponible', producto?.disponible ?? true)
  }, [producto, abierto])

  if (!abierto) return null

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400'

  const labelClass =
    'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <h2 className="mb-6 text-xl font-bold text-slate-800 dark:text-white">
          {producto ? 'Editar producto' : 'Nuevo producto'}
        </h2>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="categoria_id">
            {(field) => (
              <div>
                <label className={labelClass}>Categoría</label>
                <select
                  className={inputClass}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  required
                >
                  <option value={0} disabled>
                    Seleccioná una categoría
                  </option>
                  {categorias
                    .filter((categoria) => categoria.activo)
                    .map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="nombre">
            {(field) => (
              <div>
                <label className={labelClass}>Nombre</label>
                <input
                  className={inputClass}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                  minLength={2}
                  maxLength={150}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="descripcion">
            {(field) => (
              <div>
                <label className={labelClass}>Descripción</label>
                <textarea
                  className={inputClass}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="precio_base">
            {(field) => (
              <div>
                <label className={labelClass}>Precio base</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={inputClass}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                  placeholder="Ej: 1500.00"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="stock">
            {(field) => (
              <div>
                <label className={labelClass}>Stock</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={inputClass}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  required
                />
              </div>
            )}
          </form.Field>

          <form.Field name="imagen_url">
            {(field) => (
              <div>
                <label className={labelClass}>URL de imagen</label>
                <input
                  type="url"
                  className={inputClass}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="disponible">
            {(field) => (
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
                Producto disponible
              </label>
            )}
          </form.Field>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCerrar}
              className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
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

export default ProductoModal