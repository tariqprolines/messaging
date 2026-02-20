import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientsService } from '../services/clients'

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: clientsService.getClients,
  })
}

export const useClient = (id) => {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientsService.getClient(id),
    enabled: !!id,
  })
}

export const useCreateClient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: clientsService.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries(['clients'])
    },
  })
}

export const useUpdateClient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => clientsService.updateClient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['clients'])
      queryClient.invalidateQueries(['clients', variables.id])
    },
  })
}

export const useDeleteClient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: clientsService.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries(['clients'])
    },
  })
}
