import type { PaginatedResponse, PaginatedMeta } from '@customer-reg/shared'

export function paginatedResponse<T>(data: T[], meta: PaginatedMeta): PaginatedResponse<T> {
  return { success: true, data, meta }
}

export function buildPaginatedMeta(total: number, page: number, limit: number): PaginatedMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  }
}
