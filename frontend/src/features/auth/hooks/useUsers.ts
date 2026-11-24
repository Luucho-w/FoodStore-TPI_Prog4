
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  obtenerUsuarios,
  desactivarUsuario,
} from '../usuarioService'

import { useNotificationStore } from '@/store/notificationStore'

export function useUsers() {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  )

  const usuariosQuery = useQuery({
    queryKey: ['usuarios'],
    queryFn: obtenerUsuarios,
  })

  const desactivarMutation = useMutation({
    mutationFn: desactivarUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      showNotification('Usuario desactivado correctamente')
    },
  })

  return {
    usuarios: usuariosQuery.data ?? [],
    isLoading: usuariosQuery.isLoading,
    isError: usuariosQuery.isError,
    desactivarUsuario: desactivarMutation.mutateAsync,
    isDesactivando: desactivarMutation.isPending,
  }
}
