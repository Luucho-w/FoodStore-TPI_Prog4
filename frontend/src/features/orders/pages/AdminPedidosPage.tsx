
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  actualizarEstadoPedido,
  obtenerPedidos,
} from '../services/pedidoService'
import type { EstadoPedido } from '../services/pedidoService'

function AdminPedidosPage() {
  const queryClient = useQueryClient()
  const [filtroEstado, setFiltroEstado] = useState('TODOS')

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin-pedidos'],
    queryFn: () => obtenerPedidos(0, 100),
  })

  const actualizarMutation = useMutation({
    mutationFn: ({
      id,
      estado,
    }: {
      id: number
      estado: EstadoPedido
    }) => actualizarEstadoPedido(id, estado),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pedidos'] })
      queryClient.invalidateQueries({ queryKey: ['mis-pedidos'] })
    },
  })

  const pedidos = (data?.items ?? []).filter(
    (pedido) =>
      filtroEstado === 'TODOS' || pedido.estado === filtroEstado,
  )

  const formatoPrecio = (valor: string) =>
    Number(valor).toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
    })

  if (isLoading) {
    return <p className="py-10 text-center">Cargando pedidos...</p>
  }

  if (isError) {
    return (
      <p className="py-10 text-center text-red-600">
        No se pudieron cargar los pedidos: {error.message}
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Administración de pedidos
        </h1>
        <p className="text-slate-500">
          Consultá y gestioná los pedidos de los clientes.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="filtro-estado" className="font-medium">
          Filtrar por estado:
        </label>

        <select
          id="filtro-estado"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2"
        >
          <option value="TODOS">Todos</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="EN_PREPARACION">En preparación</option>
          <option value="ENTREGADO">Entregados</option>
          <option value="CANCELADO">Cancelados</option>
        </select>

        <span className="text-sm text-slate-500">
          {pedidos.length} pedidos
        </span>
      </div>

      {pedidos.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          No hay pedidos para mostrar.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Cambiar estado</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td className="px-4 py-3 font-semibold">
                    #{pedido.id}
                  </td>

                  <td className="px-4 py-3">
                    {pedido.nombre_usuario}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(pedido.created_at).toLocaleDateString('es-AR')}
                  </td>

                  <td className="px-4 py-3">
                    {pedido.estado.replace('_', ' ')}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {formatoPrecio(pedido.total)}
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={pedido.estado}
                      disabled={actualizarMutation.isPending}
                      onChange={(e) =>
                        actualizarMutation.mutate({
                          id: pedido.id,
                          estado: e.target.value as EstadoPedido,
                        })
                      }
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1 disabled:opacity-50"
                    >
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="EN_PREPARACION">En preparación</option>
                      <option value="ENTREGADO">Entregado</option>
                      <option value="CANCELADO">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {actualizarMutation.isError && (
        <p className="text-sm text-red-600">
          No se pudo actualizar el estado del pedido.
        </p>
      )}

      {actualizarMutation.isSuccess && (
        <p className="text-sm text-green-600">
          Estado del pedido actualizado correctamente.
        </p>
      )}
    </div>
  )
}

export default AdminPedidosPage
