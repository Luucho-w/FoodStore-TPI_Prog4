
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from '../categoriaService'

import type { CategoriaCreate } from '../types/categoria'
import { useNotificationStore } from '@/store/notificationStore'

export function useCategories() {
  const queryClient = useQueryClient()

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  )

  const categoriasQuery = useQuery({
    queryKey: ['categorias'],
    queryFn: obtenerCategorias,
  })

  const categoriasActivas = categoriasQuery.data?.filter(
    (categoria) => categoria.activo,
  ) ?? []

  const crearMutation = useMutation({
    mutationFn: crearCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      showNotification('Categoría creada correctamente')
    },
  })

  const actualizarMutation = useMutation({
    mutationFn: ({
      id,
      datos,
    }: {
      id: number
      datos: CategoriaCreate
    }) => actualizarCategoria(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      showNotification('Categoría actualizada correctamente')
    },
  })

  const eliminarMutation = useMutation({
    mutationFn: eliminarCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      showNotification('Categoría desactivada correctamente')
    },
  })

  return {
    categorias: categoriasQuery.data ?? [],
    categoriasActivas,

    isLoading: categoriasQuery.isLoading,
    isError: categoriasQuery.isError,

    crearCategoria: crearMutation.mutateAsync,
    actualizarCategoria: actualizarMutation.mutateAsync,
    eliminarCategoria: eliminarMutation.mutateAsync,

    isCreando: crearMutation.isPending,
    isActualizando: actualizarMutation.isPending,
    isEliminando: eliminarMutation.isPending,
  }
}
