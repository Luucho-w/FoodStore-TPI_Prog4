
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import {
  cancelarPedido,
  obtenerPedido,
} from '../services/pedidoService'

function PedidoDetallePage() {
  const { pedidoId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const id = Number(pedidoId)

  const {
    data: pedido,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['pedido', id],
    queryFn: () => obtenerPedido(id),
    enabled: Number.isInteger(id) && id > 0,
  })

  const cancelarMutation = useMutation({
    mutationFn: () => cancelarPedido(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedido', id] })
      queryClient.invalidateQueries({ queryKey: ['mis-pedidos'] })
    },
  })

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <p className="text-red-600 dark:text-red-400">
        El número de pedido no es válido.
      </p>
    )
  }

  if (isLoading) {
    return (
      <p className="py-10 text-center text-slate-600 dark:text-slate-300">
        Cargando pedido...
      </p>
    )
  }

  if (isError) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-600 dark:text-red-400">
          No se pudo cargar el pedido: {error.message}
        </p>
        <button
          onClick={() => navigate('/mis-pedidos')}
          className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          Volver a mis pedidos
        </button>
      </div>
    )
  }

  if (!pedido) return null

  const formatoPrecio = (valor: string) =>
    Number(valor).toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
    })

  const formatoFecha = (fecha: string) =>
    new Date(fecha).toLocaleString('es-AR')

  const puedeCancelar = pedido.estado === 'PENDIENTE'

  function manejarCancelacion() {
    const confirmar = window.confirm(
      '¿Estás seguro de que querés cancelar este pedido?',
    )

    if (confirmar) {
      cancelarMutation.mutate()
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Pedido #{pedido.id}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Realizado el {formatoFecha(pedido.created_at)}
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
          {pedido.estado.replace('_', ' ')}
        </span>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">
          Información del pedido
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Dirección de entrega
            </p>
            <p className="font-medium text-slate-800 dark:text-slate-200">
              {pedido.direccion_entrega}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Forma de pago
            </p>
            <p className="font-medium text-slate-800 dark:text-slate-200">
              {pedido.forma_pago}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Estado
            </p>
            <p className="font-medium text-slate-800 dark:text-slate-200">
              {pedido.estado.replace('_', ' ')}
            </p>
          </div>

          {pedido.notas && (
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Notas
              </p>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {pedido.notas}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">
          Productos del pedido
        </h2>

        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {pedido.detalles.map((detalle) => (
            <div
              key={detalle.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {detalle.nombre_producto}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {detalle.cantidad} x {formatoPrecio(detalle.precio_unitario)}
                </p>
              </div>

              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {formatoPrecio(detalle.subtotal)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-800 dark:border-slate-700 dark:text-white">
          <span>Total</span>
          <span>{formatoPrecio(pedido.total)}</span>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate('/mis-pedidos')}
          className="rounded-lg border border-slate-300 px-5 py-2 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Volver a mis pedidos
        </button>

        {puedeCancelar && (
          <button
            onClick={manejarCancelacion}
            disabled={cancelarMutation.isPending}
            className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {cancelarMutation.isPending ? 'Cancelando...' : 'Cancelar pedido'}
          </button>
        )}
      </div>

      {cancelarMutation.isError && (
        <p className="text-sm text-red-600 dark:text-red-400">
          No se pudo cancelar el pedido. Intentá nuevamente.
        </p>
      )}

      {cancelarMutation.isSuccess && (
        <p className="text-sm text-green-600 dark:text-green-400">
          El pedido fue cancelado correctamente.
        </p>
      )}
    </div>
  )
}

export default PedidoDetallePage
