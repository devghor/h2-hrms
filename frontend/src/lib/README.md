/**
 * Axios Configuration and Setup
 * 
 * This file provides a pre-configured axios instance with:
 * - Base URL configuration
 * - Request/Response interceptors
 * - Automatic token handling
 * - Error handling
 */

import axios from 'axios'

// Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
const REQUEST_TIMEOUT = 30000 // 30 seconds

// Create Axios Instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request Interceptor
// Automatically adds:
// - Authorization token from cookies
// - Tenant information
// - Any custom headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from cookie storage
    const cookieState = getCookie('thisisjustarandomstring')
    const token = cookieState ? JSON.parse(cookieState) : null
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add tenant header if available
    const tenantId = getCookie('tenant_id')
    if (tenantId) {
      config.headers['X-Tenant'] = tenantId
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
// Handles:
// - 401 Unauthorized (token expired)
// - 403 Forbidden (insufficient permissions)
// - 500 Server errors
// - Network errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // Handle 401 - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Clear auth data
      removeCookie('thisisjustarandomstring')
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in'
      }
    }
    
    // Handle 403 - Insufficient permissions
    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/403'
      }
    }
    
    return Promise.reject(error)
  }
)

// Helper function to get cookie
function getCookie(name: string): string | null {
  // Implementation in cookies.ts
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

// Helper function to remove cookie
function removeCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

export default axiosInstance
