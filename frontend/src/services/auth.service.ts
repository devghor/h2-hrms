import axiosInstance from '@/lib/axios'
import {
  LoginCredentials,
  RegisterCredentials,
  ChangePasswordData,
  AuthResponse,
  RefreshTokenResponse,
} from '@/types/auth.types'

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  private readonly AUTH_PREFIX = '/auth'

  /**
   * Login user with email and password
   * @param credentials - User login credentials
   * @returns Promise with authentication response
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      `${this.AUTH_PREFIX}/login`,
      credentials
    )
    return response.data
  }

  /**
   * Register a new user
   * @param credentials - User registration data
   * @returns Promise with authentication response
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      `${this.AUTH_PREFIX}/register`,
      credentials
    )
    return response.data
  }

  /**
   * Logout current user
   * @returns Promise with logout response
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.post(
      `${this.AUTH_PREFIX}/logout`,
      {}
    )
    return response.data
  }

  /**
   * Refresh authentication token
   * @returns Promise with new token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await axiosInstance.post<RefreshTokenResponse>(
      `${this.AUTH_PREFIX}/refresh`,
      {}
    )
    return response.data
  }

  /**
   * Change user password
   * @param data - Current and new password data
   * @returns Promise with response
   */
  async changePassword(
    data: ChangePasswordData
  ): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.post(
      `${this.AUTH_PREFIX}/change-password`,
      data
    )
    return response.data
  }

  /**
   * Get current authenticated user
   * @returns Promise with user data
   */
  async getMe(): Promise<{ success: boolean; data: AuthResponse['data']['user'] }> {
    const response = await axiosInstance.get('/uam/me')
    return response.data
  }
}

// Export singleton instance
export const authService = new AuthService()
