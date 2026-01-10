import axiosInstance from '@/lib/axios'
import { AuthUser } from '@/types/auth.types'
import { UsersResponse } from '@/features/uam/users/data/schema'

/**
 * User Management Service
 * Handles all user-related API calls
 */
class UserService {
  private readonly USER_PREFIX = '/uam/users'

  /**
   * Get all users with pagination
   * @returns Promise with paginated users response
   */
  async getUsers(params?: {
    page?: number
    per_page?: number
    ulid?: string
    name?: string
    email?: string
    tenant_id?: string
    from_date?: string
    to_date?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  }): Promise<UsersResponse> {
    const response = await axiosInstance.get(this.USER_PREFIX, { params })
    return response.data
  }

  /**
   * Get single user by ID
   * @param id - User ID (ULID)
   * @returns Promise with user data
   */
  async getUser(id: string): Promise<{ success: boolean; data: AuthUser }> {
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
  }): Promise<{ data: AuthUser }> {
    const response = await axiosInstance.post(this.USER_PREFIX, data)
    return response.data
  }

  /**
   * Update existing user
   * @param id - User ID (ULID)
   * @param data - User update data
   * @returns Promise with updated user
   */
  async updateUser(
    id: string,
    data: {
      name: string
      email: string
    }
  ): Promise<{ success: boolean; data: AuthUser; message: string }> {
    const response = await axiosInstance.put(`${this.USER_PREFIX}/${id}`, data)
    return response.data
  }

  /**
   * Delete user
   * @param id - User ID (ULID)
   * @returns Promise with deletion response
   */
  async deleteUser(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.delete(`${this.USER_PREFIX}/${id}`)
    return response.data
  }

  /**
   * Bulk delete users
   * @param ulids - Array of user ULIDs
   * @returns Promise with deletion response
   */
  async bulkDeleteUsers(
    ulids: string[]
  ): Promise<{ success: boolean; message: string; data: { deleted_count: number } }> {
    const response = await axiosInstance.post(`${this.USER_PREFIX}/bulk-delete`, { ulids })
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

  /**
   * Export users to Excel
   * @param filters - Optional filters for export
   * @returns Promise with blob data
   */
  async exportUsers(filters?: {
    search?: string
    role?: string
  }): Promise<Blob> {
    const response = await axiosInstance.get(`${this.USER_PREFIX}/export`, {
      params: filters,
      responseType: 'blob',
    })
    return response.data
  }
}

// Export singleton instance
export const userService = new UserService()
