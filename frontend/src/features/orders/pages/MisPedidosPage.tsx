
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { obtenerPedidos } from '../services/pedidoService'

function MisPedidosPage() {
  const navigate = useNavigate()

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['mis-pedidos'],
    queryFn: () => obtenerPedidos(0, 100),
  })

  if (isLoading) {
    return (
      <p className="py-10 text-center text-slate-600">
        Cargando tus pedidos...
      </p>
    )
  }

  if (isError) {
    return (
      <p className="py-10 text-center text-red-600">
        No se pudieron cargar tus pedidos: {error.message}
      </p>
    )
  }

  const pedidos = data?.items ?? []

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Mis pedidos
        </h1>

        <p className="mt-2 text-slate-600">
          Consultá el estado y los detalles de tus compras.
        </p>
      </div>

      {pedidos.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">
            Todavía no realizaste ningún pedido.
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-5 rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-700"
          >
            Ir al catálogo
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <article
              key={pedido.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Pedido #{pedido.id}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(pedido.created_at).toLocaleString('es-AR')}
                  </p>
                </div>

                <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                  {pedido.estado.replace('_', ' ')}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-500">
                    Forma de pago
                  </p>

                  <p className="font-medium text-slate-800">
                    {pedido.forma_pago}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Productos
                  </p>

                  <p className="font-medium text-slate-800">
                    {pedido.detalles.length}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Total
                  </p>

                  <p className="font-bold text-slate-900">
                    ${Number(pedido.total).toLocaleString('es-AR')}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/mis-pedidos/${pedido.id}`)}
                  className="rounded-lg border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
                >
                  Ver detalles
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default MisPedidosPage
