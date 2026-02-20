import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messagesService } from '../services/messages'

export const useMessages = (params = {}) => {
  return useQuery({
    queryKey: ['messages', params],
    queryFn: () => messagesService.getMessages(params),
  })
}

export const useMessage = (id) => {
  return useQuery({
    queryKey: ['messages', id],
    queryFn: () => messagesService.getMessage(id),
    enabled: !!id,
  })
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: messagesService.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages'])
    },
  })
}

export const useRetryMessage = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: messagesService.retryMessage,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(['messages'])
      queryClient.invalidateQueries(['messages', id])
    },
  })
}
