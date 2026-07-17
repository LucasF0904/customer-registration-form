export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: ApiError
}

export interface ApiError {
  code: string
  message: string
  details?: string[]
}

export interface PaginatedMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: PaginatedMeta
}

export interface PaginationQuery {
  page?: number
  limit?: number
  orderBy?: string
  order?: 'ASC' | 'DESC'
}
