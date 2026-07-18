import { CustomerEntity } from '../entities/customer.entity'

export interface CreateCustomerData {
  name: string
  cpf: string
  email: string
  colorId: string
  notes?: string
}

export interface CustomerListParams {
  page: number
  limit: number
  search?: string
  colorId?: string
}

export interface CustomerListResult {
  items: CustomerEntity[]
  total: number
}

export interface ColorStat {
  colorId: string
  colorName: string
  hexCode: string
  count: number
}

export interface CustomerStatsResult {
  total: number
  byColor: ColorStat[]
}

export interface ICustomerRepository {
  create(data: CreateCustomerData): Promise<CustomerEntity>
  existsByCpf(cpf: string): Promise<boolean>
  existsByEmail(email: string): Promise<boolean>
  findAll(params: CustomerListParams): Promise<CustomerListResult>
  findById(id: string): Promise<CustomerEntity | null>
  getStats(): Promise<CustomerStatsResult>
}

export const CUSTOMER_REPOSITORY = Symbol('ICustomerRepository')
