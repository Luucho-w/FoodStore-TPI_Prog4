
import type { Producto } from '../types/producto'

interface ProductoCardProps {
  producto: Producto
  onAgregar: (producto: Producto) => void
}

function ProductoCard({
  producto,
  onAgregar,
}: ProductoCardProps) {
  const disponible =
    producto.activo &&
    producto.disponible &&
    producto.stock > 0

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="flex h-48 items-center justify-center bg-slate-100 dark:bg-slate-700">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-5xl">🍽️</span>
        )}
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {producto.nombre}
          </h2>

          <p className="mt-1 line-clamp-2 min-h-10 text-sm text-slate-600 dark:text-slate-300">
            {producto.descripcion || 'Sin descripción disponible.'}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            ${Number(producto.precio_base).toLocaleString('es-AR')}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              disponible
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {disponible ? 'Disponible' : 'Sin stock'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAgregar(producto)}
          disabled={!disponible}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  )
}

export default ProductoCard
