import axiosInstance from '@/lib/axios'

export interface Role {
  id: number
  name: string
  guard_name: string
  permissions: Permission[]
  created_at: string
  updated_at: string
}

export interface Permission {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
}

export interface GroupedPermissions {
  [module: string]: Permission[]
}

/**
 * Role & Permission Service
 * Handles role and permission management API calls
 */
class RoleService {
  private readonly ROLE_PREFIX = '/uam/roles'
  private readonly PERMISSION_PREFIX = '/uam/permissions'

  /**
   * Get all roles with pagination
   * @returns Promise with paginated roles response
   */
  async getRoles(params?: {
    page?: number
    per_page?: number
    name?: string
    description?: string
    from_date?: string
    to_date?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  }): Promise<any> {
    const response = await axiosInstance.get(this.ROLE_PREFIX, { params })
    return response.data
  }

  /**
   * Get all roles (without pagination)
   * @returns Promise with list of roles
   */
  async getAllRoles(): Promise<{ success: boolean; data: Role[] }> {
    const response = await axiosInstance.get(`${this.ROLE_PREFIX}?per_page=1000`)
    return response.data
  }

  /**
   * Get single role by ID
   * @param id - Role ID
   * @returns Promise with role data
   */
  async getRole(id: number): Promise<{ success: boolean; data: Role }> {
    const response = await axiosInstance.get(`${this.ROLE_PREFIX}/${id}`)
    return response.data
  }

  /**
   * Create new role
   * @param data - Role creation data
   * @returns Promise with created role
   */
  async createRole(data: {
    name: string
    description?: string
    permissions?: string[]
  }): Promise<{ data: Role }> {
    const response = await axiosInstance.post(this.ROLE_PREFIX, data)
    return response.data
  }

  /**
   * Update existing role
   * @param id - Role ID
   * @param data - Role update data
   * @returns Promise with updated role
   */
  async updateRole(
    id: number,
    data: Partial<{
      name: string
      permissions: number[]
    }>
  ): Promise<{ success: boolean; data: Role; message: string }> {
    const response = await axiosInstance.put(`${this.ROLE_PREFIX}/${id}`, data)
    return response.data
  }

  /**
   * Delete role
   * @param id - Role ID
   * @returns Promise with deletion response
   */
  async deleteRole(id: number): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.delete(`${this.ROLE_PREFIX}/${id}`)
    return response.data
  }

  /**
   * Assign permissions to role
   * @param roleId - Role ID
   * @param permissionIds - Array of permission IDs
   * @returns Promise with response
   */
  async assignPermissions(
    roleId: number,
    permissionIds: number[]
  ): Promise<{ success: boolean; data: Role; message: string }> {
    const response = await axiosInstance.post(
      `${this.ROLE_PREFIX}/${roleId}/permissions`,
      { permissions: permissionIds }
    )
    return response.data
  }

  /**
   * Get all permissions
   * @returns Promise with list of permissions
   */
  async getPermissions(): Promise<{ success: boolean; data: Permission[] }> {
    const response = await axiosInstance.get(this.PERMISSION_PREFIX)
    return response.data
  }

  /**
   * Get permissions grouped by module
   * @returns Promise with grouped permissions
   */
  async getGroupedPermissions(): Promise<{
    success: boolean
    data: GroupedPermissions
  }> {
    const response = await axiosInstance.get(
      `${this.PERMISSION_PREFIX}/grouped`
    )
    return response.data
  }

  /**
   * Get current user's permissions
   * @returns Promise with user permissions
   */
  async getUserPermissions(): Promise<{
    success: boolean
    data: string[]
  }> {
    const response = await axiosInstance.get(`${this.PERMISSION_PREFIX}/user`)
    return response.data
  }

    /**
   * Bulk delete roles
   * @param ids - Array of role IDs
   * @returns Promise with deletion response
   */
  async bulkDeleteRoles(ids: number[]): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.post(`${this.ROLE_PREFIX}/bulk-delete`, {
      ids,
    })
    return response.data
  }

  /**
   * Bulk delete users by ULIDs
   * @param ulids - Array of user ULIDs
   * @returns Promise with deletion response
   */
  async bulkDeleteUsers(ulids: string[]): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.post(`${this.ROLE_PREFIX}/bulk-delete`, {
      ulids,
    })
    return response.data
  }

  /**
   * Export roles to Excel
   * @param filters - Optional filters for export
   * @returns Promise with blob data
   */
  async exportRoles(filters?: {
    search?: string
  }): Promise<Blob> {
    const response = await axiosInstance.get(`${this.ROLE_PREFIX}/export`, {
      params: filters,
      responseType: 'blob',
    })
    return response.data
  }
}

// Export singleton instance
export const roleService = new RoleService()
