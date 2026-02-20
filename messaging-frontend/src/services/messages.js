/**
 * Messages API service
 */
import apiClient from './api'

export const messagesService = {
  /**
   * Send a message
   */
  async sendMessage(messageData) {
    const response = await apiClient.post('/messages/send', messageData)
    return response.data
  },

  /**
   * Get all messages
   */
  async getMessages(params = {}) {
    const response = await apiClient.get('/messages', { params })
    return response.data
  },

  /**
   * Get a single message by ID
   */
  async getMessage(id) {
    const response = await apiClient.get(`/messages/${id}`)
    return response.data
  },

  /**
   * Retry a failed message
   */
  async retryMessage(id) {
    const response = await apiClient.post(`/messages/${id}/retry`)
    return response.data
  },
}
