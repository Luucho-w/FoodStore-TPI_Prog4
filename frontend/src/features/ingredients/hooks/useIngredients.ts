
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  obtenerIngredientes,
  crearIngrediente,
  actualizarIngrediente,
  eliminarIngrediente,
} from '../ingredienteService'

import type { IngredienteCreate } from '../types/ingrediente'
import { useNotificationStore } from '@/store/notificationStore'

export function useIngredients() {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  )

  const ingredientesQuery = useQuery({
    queryKey: ['ingredientes'],
    queryFn: obtenerIngredientes,
  })

  const crearMutation = useMutation({
    mutationFn: crearIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      showNotification('Ingrediente creado correctamente')
    },
  })

  const actualizarMutation = useMutation({
    mutationFn: ({
      id,
      datos,
    }: {
      id: number
      datos: IngredienteCreate
    }) => actualizarIngrediente(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      showNotification('Ingrediente actualizado correctamente')
    },
  })

  const eliminarMutation = useMutation({
    mutationFn: eliminarIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      showNotification('Ingrediente eliminado correctamente')
    },
  })

  return {
    ingredientes: ingredientesQuery.data ?? [],
    isLoading: ingredientesQuery.isLoading,
    isError: ingredientesQuery.isError,
    refetch: ingredientesQuery.refetch,

    crearIngrediente: crearMutation.mutateAsync,
    actualizarIngrediente: actualizarMutation.mutateAsync,
    eliminarIngrediente: eliminarMutation.mutateAsync,

    isCreando: crearMutation.isPending,
    isActualizando: actualizarMutation.isPending,
    isEliminando: eliminarMutation.isPending,
  }
}
