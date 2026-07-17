import { Injectable, Inject } from '@nestjs/common'
import { IColorRepository } from '../../../domain/repositories/color-repository.interface'
import { COLOR_REPOSITORY } from '../../../domain/repositories/color-repository.interface'
import { ColorEntity } from '../../../domain/entities/color.entity'

@Injectable()
export class ListColorsUseCase {
  constructor(
    @Inject(COLOR_REPOSITORY)
    private readonly colorRepository: IColorRepository,
  ) {}

  async execute(): Promise<ColorEntity[]> {
    return this.colorRepository.findAll()
  }
}
