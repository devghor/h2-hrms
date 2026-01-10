import axiosInstance from '@/lib/axios'

/**
 * Designation Management Service
 * Handles all designation-related API calls
 */
class DesignationService {
  private readonly DESIGNATION_PREFIX = '/base/designations'

  /**
   * Get all designations with pagination
   * @returns Promise with paginated designations response
   */
  async getDesignations(params?: {
    page?: number
    per_page?: number
    search?: string
    level?: number
  }): Promise<any> {
    const response = await axiosInstance.get(this.DESIGNATION_PREFIX, { params })
    return response.data
  }

  /**
   * Get all designations without pagination
   * @returns Promise with all designations
   */
  async getAllDesignations(): Promise<any> {
    const response = await axiosInstance.get(`${this.DESIGNATION_PREFIX}/all`)
    return response.data
  }

  /**
   * Get single designation by ID
   * @param id - Designation ID (ULID)
   * @returns Promise with designation data
   */
  async getDesignation(id: string): Promise<any> {
    const response = await axiosInstance.get(`${this.DESIGNATION_PREFIX}/${id}`)
    return response.data
  }

  /**
   * Create new designation
   * @param data - Designation creation data
   * @returns Promise with created designation
   */
  async createDesignation(data: {
    name: string
    description?: string
    level: number
  }): Promise<any> {
    const response = await axiosInstance.post(this.DESIGNATION_PREFIX, data)
    return response.data
  }

  /**
   * Update existing designation
   * @param id - Designation ID (ULID)
   * @param data - Designation update data
   * @returns Promise with updated designation
   */
  async updateDesignation(
    id: string,
    data: {
      name: string
      description?: string
      level: number
    }
  ): Promise<any> {
    const response = await axiosInstance.put(`${this.DESIGNATION_PREFIX}/${id}`, data)
    return response.data
  }

  /**
   * Delete designation
   * @param id - Designation ID (ULID)
   * @returns Promise with deletion response
   */
  async deleteDesignation(id: string): Promise<any> {
    const response = await axiosInstance.delete(`${this.DESIGNATION_PREFIX}/${id}`)
    return response.data
  }

  /**
   * Restore soft deleted designation
   * @param ulid - Designation ULID
   * @returns Promise with restore response
   */
  async restoreDesignation(ulid: string): Promise<any> {
    const response = await axiosInstance.post(`${this.DESIGNATION_PREFIX}/${ulid}/restore`)
    return response.data
  }

  /**
   * Export designations to Excel
   * @param filters - Optional filters for export
   * @returns Promise with blob data
   */
  async exportDesignations(filters?: {
    search?: string
    level?: number
    include_deleted?: boolean
  }): Promise<Blob> {
    const response = await axiosInstance.get(`${this.DESIGNATION_PREFIX}/export`, {
      params: filters,
      responseType: 'blob',
    })
    return response.data
  }
}

// Export singleton instance
export const designationService = new DesignationService()
