export interface LoginDto {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  admin: {
    email: string
  }
}

export interface CustomerListItem {
  id: string
  name: string
  cpf: string
  email: string
  color: {
    id: string
    name: string
    hexCode: string
  }
  notes?: string
  createdAt: string
}

export interface CustomerStats {
  total: number
  byColor: Array<{
    colorId: string
    colorName: string
    hexCode: string
    count: number
  }>
}

export interface CustomerListQuery {
  page?: number
  limit?: number
  search?: string
  colorId?: string
}
