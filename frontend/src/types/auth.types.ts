/**
 * Authentication related types
 */

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  password_confirmation: string
  tenant_id?: string
}

export interface ChangePasswordData {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

export interface AuthUser {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  tenant_id: string
  roles?: Array<{
    id: number
    name: string
    guard_name: string
  }>
  permissions?: string[]
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: AuthUser
    access_token: string
    token_type: string
    expires_at: string
  }
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors?: Record<string, string[]>
}

export interface RefreshTokenResponse {
  success: boolean
  message: string
  data: {
    access_token: string
    token_type: string
    expires_at: string
  }
}
