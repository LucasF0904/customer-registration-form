import type { CustomerEntity } from '../entities/customer.entity'

export interface CreateCustomerData {
  name: string
  cpf: string
  email: string
  colorId: string
  notes?: string
}

export interface ICustomerRepository {
  create(data: CreateCustomerData): Promise<CustomerEntity>
  existsByCpf(cpf: string): Promise<boolean>
  existsByEmail(email: string): Promise<boolean>
}

export const CUSTOMER_REPOSITORY = Symbol('ICustomerRepository')
