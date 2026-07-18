import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { CustomerTypeOrmEntity } from '../entities/customer.typeorm-entity'
import {
  ICustomerRepository,
  CreateCustomerData,
  CustomerListParams,
  CustomerListResult,
  CustomerStatsResult,
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
      cpfHash: data.cpfHash,
      cpfMasked: data.cpfMasked,
      cpfFingerprint: data.cpfFingerprint,
      email: data.email,
      colorId: data.colorId,
      notes: data.notes,
    })
    const saved = await this.repo.save(entity)
    const withRelations = await this.repo.findOneOrFail({ where: { id: saved.id } })
    return this.toDomain(withRelations)
  }

  async existsByCpfFingerprint(fingerprint: string): Promise<boolean> {
    return this.repo.existsBy({ cpfFingerprint: fingerprint })
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.repo.existsBy({ email })
  }

  async findAll(params: CustomerListParams): Promise<CustomerListResult> {
    const { page, limit, search, colorId } = params
    const skip = (page - 1) * limit

    const where = search
      ? [
          { name: ILike(`%${search}%`), ...(colorId ? { colorId } : {}) },
          { email: ILike(`%${search}%`), ...(colorId ? { colorId } : {}) },
          { cpfMasked: ILike(`%${search}%`), ...(colorId ? { colorId } : {}) },
        ]
      : colorId
        ? [{ colorId }]
        : {}

    const [rows, total] = await this.repo.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    })

    return { items: rows.map((r) => this.toDomain(r)), total }
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    const row = await this.repo.findOneBy({ id })
    return row ? this.toDomain(row) : null
  }

  async getStats(): Promise<CustomerStatsResult> {
    const total = await this.repo.count()

    const byColor = await this.repo
      .createQueryBuilder('c')
      .select('c.color_id', 'colorId')
      .addSelect('col.name', 'colorName')
      .addSelect('col.hex_code', 'hexCode')
      .addSelect('COUNT(c.id)::int', 'count')
      .innerJoin('c.color', 'col')
      .groupBy('c.color_id, col.name, col.hex_code')
      .orderBy('count', 'DESC')
      .getRawMany<{ colorId: string; colorName: string; hexCode: string; count: number }>()

    return { total, byColor }
  }

  private toDomain(row: CustomerTypeOrmEntity): CustomerEntity {
    const color = new ColorEntity(
      row.color.id,
      row.color.name,
      row.color.hexCode,
      row.color.createdAt,
    )
    return new CustomerEntity(
      row.id,
      row.name,
      row.cpfHash,
      row.cpfMasked,
      row.cpfFingerprint,
      row.email,
      color,
      row.createdAt,
      row.notes,
    )
  }
}
