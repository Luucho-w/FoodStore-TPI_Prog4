
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../productoService'

import type {
  ProductoCreate,
  ProductoFiltros,
} from '../productoService'

import { useNotificationStore } from '@/store/notificationStore'

export function useProducts(
  filtros: ProductoFiltros = { skip: 0, limit: 100 },
) {
  const queryClient = useQueryClient()

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  )

  const productosQuery = useQuery({
    queryKey: ['productos', filtros],
    queryFn: () => obtenerProductos(filtros),
  })

  const crearMutation = useMutation({
    mutationFn: crearProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      showNotification('Producto creado correctamente')
    },
  })

  const actualizarMutation = useMutation({
    mutationFn: ({
      id,
      datos,
    }: {
      id: number
      datos: ProductoCreate
    }) => actualizarProducto(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      showNotification('Producto actualizado correctamente')
    },
  })

  const eliminarMutation = useMutation({
    mutationFn: eliminarProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      showNotification('Producto desactivado correctamente')
    },
  })

  return {
    productos: productosQuery.data?.items ?? [],
    total: productosQuery.data?.total ?? 0,

    isLoading: productosQuery.isLoading,
    isError: productosQuery.isError,

    crearProducto: crearMutation.mutateAsync,
    actualizarProducto: actualizarMutation.mutateAsync,
    eliminarProducto: eliminarMutation.mutateAsync,

    isCreando: crearMutation.isPending,
    isActualizando: actualizarMutation.isPending,
    isEliminando: eliminarMutation.isPending,
  }
}
