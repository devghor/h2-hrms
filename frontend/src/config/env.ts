/**
 * Environment Configuration
 * 
 * Centralized configuration for environment variables
 */

interface Config {
  apiBaseUrl: string
  appName: string
  appVersion: string
  isDevelopment: boolean
  isProduction: boolean
}

export const config: Config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  appName: import.meta.env.VITE_APP_NAME || 'H2 HRMS',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}

// Validate required environment variables
const requiredEnvVars = ['VITE_API_BASE_URL']

requiredEnvVars.forEach((key) => {
  if (!import.meta.env[key]) {
    console.warn(`Warning: ${key} is not set in environment variables`)
  }
})
