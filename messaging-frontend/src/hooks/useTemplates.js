import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { templatesService } from '../services/templates'

export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: templatesService.getTemplates,
  })
}

export const useTemplate = (id) => {
  return useQuery({
    queryKey: ['templates', id],
    queryFn: () => templatesService.getTemplate(id),
    enabled: !!id,
  })
}

export const useCreateTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: templatesService.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries(['templates'])
    },
  })
}

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => templatesService.updateTemplate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['templates'])
      queryClient.invalidateQueries(['templates', variables.id])
    },
  })
}

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: templatesService.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries(['templates'])
    },
  })
}
