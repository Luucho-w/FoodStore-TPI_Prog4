
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'

function CartPage() {
  const navigate = useNavigate()

  const items = useCartStore((state) => state.items)
  const cambiarCantidad = useCartStore((state) => state.cambiarCantidad)
  const quitarProducto = useCartStore((state) => state.quitarProducto)
  const vaciarCarrito = useCartStore((state) => state.vaciarCarrito)
  const obtenerTotal = useCartStore((state) => state.obtenerTotal)

  const total = obtenerTotal()

  if (items.length === 0) {
    return (
      <section className="space-y-4 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Mi carrito
        </h1>

        <p className="text-slate-600 dark:text-slate-300">
          Tu carrito está vacío.
        </p>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-block rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Volver al catálogo
        </button>
      </section>
    )
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Mi carrito
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Revisá los productos que agregaste.
          </p>
        </div>

        <button
          type="button"
          onClick={vaciarCarrito}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.producto_id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                {item.nombre}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                ${item.precio_unitario.toLocaleString('es-AR')} por unidad
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  cambiarCantidad(item.producto_id, item.cantidad - 1)
                }
                className="h-9 w-9 rounded-lg border border-slate-300 font-bold dark:border-slate-600 dark:text-white"
                aria-label={`Disminuir cantidad de ${item.nombre}`}
              >
                -
              </button>

              <span className="min-w-6 text-center font-semibold dark:text-white">
                {item.cantidad}
              </span>

              <button
                type="button"
                onClick={() =>
                  cambiarCantidad(item.producto_id, item.cantidad + 1)
                }
                className="h-9 w-9 rounded-lg border border-slate-300 font-bold dark:border-slate-600 dark:text-white"
                aria-label={`Aumentar cantidad de ${item.nombre}`}
              >
                +
              </button>
            </div>

            <div className="text-right">
              <p className="font-bold text-slate-900 dark:text-white">
                ${(item.precio_unitario * item.cantidad).toLocaleString('es-AR')}
              </p>

              <button
                type="button"
                onClick={() => quitarProducto(item.producto_id)}
                className="mt-1 text-sm text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="ml-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            Total
          </span>

          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            ${total.toLocaleString('es-AR')}
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="mt-6 w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Finalizar compra
        </button>
      </div>
    </section>
  )
}

export default CartPage
