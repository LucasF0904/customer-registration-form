import { AdminEntity } from '../entities/admin.entity'

export interface IAdminRepository {
  findByEmail(email: string): Promise<AdminEntity | null>
}

export const ADMIN_REPOSITORY = Symbol('IAdminRepository')
