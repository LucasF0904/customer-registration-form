import type { ApiResponse, ApiError } from '@customer-reg/shared'

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return message !== undefined ? { success: true, data, message } : { success: true, data }
}

export function errorResponse(code: string, message: string, details?: string[]): ApiResponse {
  const error: ApiError = { code, message, ...(details?.length ? { details } : {}) }
  return { success: false, error }
}
