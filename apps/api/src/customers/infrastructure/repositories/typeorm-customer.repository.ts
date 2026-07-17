import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { CustomerTypeOrmEntity } from '../entities/customer.typeorm-entity'
import type {
  ICustomerRepository,
  CreateCustomerData,
} from '../../domain/repositories/customer-repository.interface'
import { CustomerEntity } from '../../domain/entities/customer.entity'
import { ColorEntity } from '../../../colors/domain/entities/color.entity'

@Injectable()
export class TypeOrmCustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerTypeOrmEntity)
    private readonly repo: Repository<CustomerTypeOrmEntity>,
  ) {}

  async create(data: CreateCustomerData): Promise<CustomerEntity> {
    const entity = this.repo.create({
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      colorId: data.colorId,
      notes: data.notes,
    })
    const saved = await this.repo.save(entity)
    return this.toDomain(saved)
  }

  async existsByCpf(cpf: string): Promise<boolean> {
    return this.repo.existsBy({ cpf })
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.repo.existsBy({ email })
  }

  private toDomain(row: CustomerTypeOrmEntity): CustomerEntity {
    const color = new ColorEntity(
      row.color.id,
      row.color.name,
      row.color.hexCode,
      row.color.createdAt,
    )
    return new CustomerEntity(row.id, row.name, row.cpf, row.email, color, row.createdAt, row.notes)
  }
}
