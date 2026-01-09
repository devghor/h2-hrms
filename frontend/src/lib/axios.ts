import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { getCookie, removeCookie } from './cookies'
import { useAuthStore } from '@/stores/auth-store'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const TOKEN_EXPIRY = 'token_expiry'

/**
 * Create axios instance with default config
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/**
 * Request Interceptor
 * - Checks token expiry before making requests
 * - Adds authorization token to requests
 * - Adds tenant information if available
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from cookie
    const cookieState = getCookie(ACCESS_TOKEN)
    const token = cookieState ? cookieState : null

    // Check if token is expired
    if (token) {
      const tokenExpiry = getCookie(TOKEN_EXPIRY)
      if (tokenExpiry) {
        const expiryTime = new Date(tokenExpiry).getTime()
        const currentTime = new Date().getTime()
        
        // If token is expired, clear auth and redirect to login
        if (currentTime >= expiryTime) {
          // Clear cookies
          removeCookie(ACCESS_TOKEN)
          removeCookie(TOKEN_EXPIRY)
          removeCookie('tenant_id')
          
          // Reset auth store
          const { auth } = useAuthStore.getState()
          auth.reset()
          
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/sign-in?redirect=' + encodeURIComponent(window.location.pathname)
          }
          
          return Promise.reject(new Error('Token expired'))
        }
      }
      
      // Add authorization header if token exists and not expired
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add tenant information if available
    const tenantId = getCookie('tenant_id')
    if (tenantId) {
      config.headers['X-Tenant'] = tenantId
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * - Handles successful responses
 * - Handles error responses globally
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Clear authentication data
      removeCookie(ACCESS_TOKEN)
      removeCookie(TOKEN_EXPIRY)
      removeCookie('tenant_id')
      
      // Reset auth store
      const { auth } = useAuthStore.getState()
      auth.reset()

      // Redirect to login page with current path for redirect after login
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in?redirect=' + encodeURIComponent(window.location.pathname)
      }

      return Promise.reject(error)
    }

    // Handle 403 Forbidden - Insufficient permissions
    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/403'
      }
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('Internal server error:', error)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
