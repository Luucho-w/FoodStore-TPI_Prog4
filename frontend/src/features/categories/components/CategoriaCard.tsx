
import type { Categoria } from '../types/categoria'

interface CategoriaCardProps {
  categoria: Categoria
  onEditar: (categoria: Categoria) => void
  onEliminar: (id: number) => void
}

function CategoriaCard({
  categoria,
  onEditar,
  onEliminar,
}: CategoriaCardProps) {
  return (
    <article className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-800">
            {categoria.nombre}
          </h3>

          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            ID: {categoria.id}
          </span>
        </div>

        <p className="text-sm leading-6 text-slate-600">
          {categoria.descripcion || 'Sin descripción'}
        </p>

        <span
          className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            categoria.activo
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {categoria.activo ? 'Activa' : 'Desactivada'}
        </span>
      </div>

      <div className="flex gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onEditar(categoria)}
          className="flex-1 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          Editar
        </button>

        <button
          type="button"
          disabled={!categoria.activo}
          onClick={() => {
            if (
              window.confirm(
                `¿Seguro que querés desactivar "${categoria.nombre}"?`,
              )
            ) {
              onEliminar(categoria.id)
            }
          }}
          className="flex-1 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-40"
        >
          Desactivar
        </button>
      </div>
    </article>
  )
}

export default CategoriaCard
