/**
 * Client contact API service
 */
import apiClient from './api'

export const clientsService = {
  /**
   * Get all client contacts
   */
  async getClients() {
    const response = await apiClient.get('/clients')
    return response.data
  },

  /**
   * Get a single client by ID
   */
  async getClient(id) {
    const response = await apiClient.get(`/clients/${id}`)
    return response.data
  },

  /**
   * Create a new client contact
   */
  async createClient(clientData) {
    const response = await apiClient.post('/clients', clientData)
    return response.data
  },

  /**
   * Update a client contact
   */
  async updateClient(id, clientData) {
    const response = await apiClient.put(`/clients/${id}`, clientData)
    return response.data
  },

  /**
   * Delete a client contact
   */
  async deleteClient(id) {
    const response = await apiClient.delete(`/clients/${id}`)
    return response.data
  },
}
