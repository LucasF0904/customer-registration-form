import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { ColorTypeOrmEntity } from '../entities/color.typeorm-entity'
import type { IColorRepository } from '../../domain/repositories/color-repository.interface'
import { ColorEntity } from '../../domain/entities/color.entity'

@Injectable()
export class TypeOrmColorRepository implements IColorRepository {
  constructor(
    @InjectRepository(ColorTypeOrmEntity)
    private readonly repo: Repository<ColorTypeOrmEntity>,
  ) {}

  async findAll(): Promise<ColorEntity[]> {
    const rows = await this.repo.find({ order: { name: 'ASC' } })
    return rows.map(this.toDomain)
  }

  async findById(id: string): Promise<ColorEntity | null> {
    const row = await this.repo.findOne({ where: { id } })
    return row ? this.toDomain(row) : null
  }

  private toDomain(row: ColorTypeOrmEntity): ColorEntity {
    return new ColorEntity(row.id, row.name, row.hexCode, row.createdAt)
  }
}
