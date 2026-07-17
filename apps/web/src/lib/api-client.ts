import type {
  ApiResponse,
  RainbowColor,
  RegisterCustomerDto,
  RegisterCustomerResponse,
} from '@customer-reg/shared'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })

  const body = (await res.json()) as T

  if (!res.ok) {
    throw body
  }

  return body
}

export const apiClient = {
  colors: {
    list(): Promise<ApiResponse<RainbowColor[]>> {
      return request<ApiResponse<RainbowColor[]>>('/colors')
    },
  },

  customers: {
    register(dto: RegisterCustomerDto): Promise<ApiResponse<RegisterCustomerResponse>> {
      return request<ApiResponse<RegisterCustomerResponse>>('/customers', {
        method: 'POST',
        body: JSON.stringify(dto),
      })
    },
  },
} as const
