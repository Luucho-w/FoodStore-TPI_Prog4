
import type { Producto } from '../types/producto'
import ProductoCard from './ProductoCard'

interface ProductoCatalogoProps {
  productos: Producto[]
  onAgregar: (producto: Producto) => void
}

function ProductoCatalogo({
  productos,
  onAgregar,
}: ProductoCatalogoProps) {
  if (productos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800">
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
          No encontramos productos.
        </p>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Probá cambiar la búsqueda o seleccionar otra categoría.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {productos.map((producto) => (
        <ProductoCard
          key={producto.id}
          producto={producto}
          onAgregar={onAgregar}
        />
      ))}
    </div>
  )
}

export default ProductoCatalogo
