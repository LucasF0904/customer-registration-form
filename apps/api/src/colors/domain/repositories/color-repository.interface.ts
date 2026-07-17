import { ColorEntity } from '../entities/color.entity'

export interface IColorRepository {
  findAll(): Promise<ColorEntity[]>
  findById(id: string): Promise<ColorEntity | null>
}

export const COLOR_REPOSITORY = Symbol('IColorRepository')
