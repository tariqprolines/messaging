/**
 * Application configuration
 */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1'
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000')

export const API_BASE_URL = `${API_URL}/api/${API_VERSION}`
