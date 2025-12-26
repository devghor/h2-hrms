import axiosInstance from '@/lib/axios'
import { AuthUser } from '@/types/auth.types'

/**
 * User Management Service
 * Handles all user-related API calls
 */
class UserService {
  private readonly USER_PREFIX = '/uam/users'

  /**
   * Get all users
   * @returns Promise with list of users
   */
  async getUsers(params?: {
    page?: number
    per_page?: number
    search?: string
    role?: string
  }): Promise<{
    success: boolean
    data: AuthUser[]
    meta?: {
      current_page: number
      total: number
      per_page: number
      last_page: number
    }
  }> {
    const response = await axiosInstance.get(this.USER_PREFIX, { params })
    return response.data
  }

  /**
   * Get single user by ID
   * @param id - User ID
   * @returns Promise with user data
   */
  async getUser(id: number): Promise<{ success: boolean; data: AuthUser }> {
    const response = await axiosInstance.get(`${this.USER_PREFIX}/${id}`)
    return response.data
  }

  /**
   * Create new user
   * @param data - User creation data
   * @returns Promise with created user
   */
  async createUser(data: {
    name: string
    email: string
    password: string
    password_confirmation: string
    roles?: string[]
  }): Promise<{ success: boolean; data: AuthUser; message: string }> {
    const response = await axiosInstance.post(this.USER_PREFIX, data)
    return response.data
  }

  /**
   * Update existing user
   * @param id - User ID
   * @param data - User update data
   * @returns Promise with updated user
   */
  async updateUser(
    id: number,
    data: Partial<{
      name: string
      email: string
      roles: string[]
    }>
  ): Promise<{ success: boolean; data: AuthUser; message: string }> {
    const response = await axiosInstance.put(`${this.USER_PREFIX}/${id}`, data)
    return response.data
  }

  /**
   * Delete user
   * @param id - User ID
   * @returns Promise with deletion response
   */
  async deleteUser(
    id: number
  ): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.delete(`${this.USER_PREFIX}/${id}`)
    return response.data
  }

  /**
   * Get current authenticated user
   * @returns Promise with current user data
   */
  async getCurrentUser(): Promise<{
    success: boolean
    data: AuthUser
  }> {
    const response = await axiosInstance.get('/uam/me')
    return response.data
  }
}

// Export singleton instance
export const userService = new UserService()
