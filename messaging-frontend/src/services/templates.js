/**
 * Message templates API service
 */
import apiClient from './api'

export const templatesService = {
  /**
   * Get all templates
   */
  async getTemplates() {
    const response = await apiClient.get('/templates')
    return response.data
  },

  /**
   * Get a single template by ID
   */
  async getTemplate(id) {
    const response = await apiClient.get(`/templates/${id}`)
    return response.data
  },

  /**
   * Create a new template
   */
  async createTemplate(templateData) {
    const response = await apiClient.post('/templates', templateData)
    return response.data
  },

  /**
   * Update a template
   */
  async updateTemplate(id, templateData) {
    const response = await apiClient.put(`/templates/${id}`, templateData)
    return response.data
  },

  /**
   * Delete a template
   */
  async deleteTemplate(id) {
    const response = await apiClient.delete(`/templates/${id}`)
    return response.data
  },
}
