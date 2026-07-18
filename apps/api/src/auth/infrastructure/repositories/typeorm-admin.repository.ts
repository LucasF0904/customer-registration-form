import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AdminTypeOrmEntity } from '../entities/admin.typeorm-entity'
import { IAdminRepository } from '../../domain/repositories/admin-repository.interface'
import { AdminEntity } from '../../domain/entities/admin.entity'

@Injectable()
export class TypeOrmAdminRepository implements IAdminRepository {
  constructor(
    @InjectRepository(AdminTypeOrmEntity)
    private readonly repo: Repository<AdminTypeOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<AdminEntity | null> {
    const row = await this.repo.findOneBy({ email })
    if (!row) return null
    return new AdminEntity(row.id, row.email, row.passwordHash, row.createdAt)
  }
}
