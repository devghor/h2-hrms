import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { getCookie, removeCookie } from './cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'

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
 * - Adds authorization token to requests
 * - Adds tenant information if available
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from cookie
    const cookieState = getCookie(ACCESS_TOKEN)
    const token = cookieState ? JSON.parse(cookieState) : null

    // Add authorization header if token exists
    if (token) {
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

      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in'
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
