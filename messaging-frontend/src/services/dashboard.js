/**
 * Dashboard API service
 */
import apiClient from './api'
import { clientsService } from './clients'
import { messagesService } from './messages'
import { templatesService } from './templates'

export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  async getStats() {
    try {
      const [clients, messages, templates] = await Promise.all([
        clientsService.getClients().catch(() => []),
        messagesService.getMessages().catch(() => []),
        templatesService.getTemplates().catch(() => []),
      ])

      const clientsData = Array.isArray(clients) ? clients : []
      const messagesData = Array.isArray(messages) ? messages : []
      const templatesData = Array.isArray(templates) ? templates : []

      return {
        totalClients: clientsData.length,
        totalMessages: messagesData.length,
        totalTemplates: templatesData.length,
        messagesToday: messagesData.filter((msg) => {
          const today = new Date()
          const msgDate = new Date(msg.created_at)
          return msgDate.toDateString() === today.toDateString()
        }).length,
        messagesThisWeek: messagesData.filter((msg) => {
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return new Date(msg.created_at) >= weekAgo
        }).length,
        deliveredMessages: messagesData.filter((msg) => msg.status === 'delivered').length,
        failedMessages: messagesData.filter((msg) => msg.status === 'failed').length,
        recentMessages: messagesData.slice(0, 10),
        recentClients: clientsData.slice(0, 5),
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return {
        totalClients: 0,
        totalMessages: 0,
        totalTemplates: 0,
        messagesToday: 0,
        messagesThisWeek: 0,
        deliveredMessages: 0,
        failedMessages: 0,
        recentMessages: [],
        recentClients: [],
      }
    }
  },
}
