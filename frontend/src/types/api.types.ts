/**
 * HTTP Status Codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * Generic API Response
 */
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: {
    current_page: number
    total: number
    per_page: number
    last_page: number
    from: number
    to: number
  }
  links?: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}

/**
 * Query Parameters for list endpoints
 */
export interface QueryParams {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  [key: string]: any
}
