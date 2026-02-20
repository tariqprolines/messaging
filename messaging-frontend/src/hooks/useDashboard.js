import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboard'

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}
