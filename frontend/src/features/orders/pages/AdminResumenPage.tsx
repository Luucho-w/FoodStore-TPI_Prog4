
import { useQuery } from '@tanstack/react-query'
import { obtenerResumenPedidos } from '../services/pedidoService'

function AdminResumenPage() {
  const {
    data: resumen,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin-resumen-pedidos'],
    queryFn: obtenerResumenPedidos,
  })

  if (isLoading) {
    return <p className="py-10 text-center">Cargando resumen...</p>
  }

  if (isError) {
    return (
      <p className="py-10 text-center text-red-600">
        No se pudo cargar el resumen: {error.message}
      </p>
    )
  }

  if (!resumen) return null

  const formatoPrecio = (valor: string) =>
    Number(valor).toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
    })

  const indicadores = [
    {
      titulo: 'Pendientes',
      valor: resumen.pendientes,
    },
    {
      titulo: 'En preparación',
      valor: resumen.en_preparacion,
    },
    {
      titulo: 'Entregados',
      valor: resumen.entregados,
    },
    {
      titulo: 'Cancelados',
      valor: resumen.cancelados,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Resumen de pedidos
        </h1>
        <p className="text-slate-500">
          Indicadores generales de las ventas y los pedidos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {indicadores.map((indicador) => (
          <div
            key={indicador.titulo}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {indicador.titulo}
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-800">
              {indicador.valor}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Pedidos realizados hoy
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {resumen.pedidos_hoy}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total vendido
          </p>
          <p className="mt-2 text-3xl font-bold text-green-700">
            {formatoPrecio(resumen.total_vendido)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminResumenPage
