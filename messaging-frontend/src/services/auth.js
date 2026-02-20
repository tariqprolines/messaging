/**
 * Authentication service
 */
import apiClient from './api'
import { STORAGE_KEYS } from '../utils/constants'

export const authService = {
  /**
   * Sign up a new user
   */
  async signup(email, password, companyName) {
    const response = await apiClient.post('/auth/signup', {
      email,
      password,
      company_name: companyName,
    })
    
    const { access_token, refresh_token } = response.data
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
    if (refresh_token) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token)
    }
    
    return response.data
  },

  /**
   * Log in a user
   */
  async login(email, password) {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    })
    
    const { access_token, refresh_token } = response.data
    
    console.log('Access token:', access_token)
    console.log('Refresh token:', refresh_token)
    
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
    if (refresh_token) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token)
    }
    
    return response.data
  },

  /**
   * Log out the current user
   */
  logout() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  },

  /**
   * Get access token
   */
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  },
}

