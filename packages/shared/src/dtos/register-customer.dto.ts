export interface RegisterCustomerDto {
  name: string
  cpf: string
  email: string
  colorId: string
  notes?: string
}

export interface RegisterCustomerResponse {
  id: string
  name: string
  cpfMasked: string
  email: string
  color: {
    id: string
    name: string
    hexCode: string
  }
  notes?: string
  createdAt: string
}
