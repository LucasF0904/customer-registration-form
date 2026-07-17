import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ListColorsUseCase } from './list-colors.use-case'
import type { IColorRepository } from '../../../domain/repositories/color-repository.interface'
import { ColorEntity } from '../../../domain/entities/color.entity'

const mockColorRepo: IColorRepository = {
  findAll: vi.fn(),
  findById: vi.fn(),
}

describe('ListColorsUseCase', () => {
  let useCase: ListColorsUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    useCase = new ListColorsUseCase(mockColorRepo)
  })

  it('should return all colors', async () => {
    const colors = [
      new ColorEntity('id-1', 'Vermelho', '#E53E3E', new Date()),
      new ColorEntity('id-2', 'Azul', '#4299E1', new Date()),
    ]
    vi.mocked(mockColorRepo.findAll).mockResolvedValue(colors)

    const result = await useCase.execute()

    expect(result).toHaveLength(2)
    expect(result[0]).toBeInstanceOf(ColorEntity)
    expect(mockColorRepo.findAll).toHaveBeenCalledTimes(1)
  })

  it('should return empty array when no colors exist', async () => {
    vi.mocked(mockColorRepo.findAll).mockResolvedValue([])
    const result = await useCase.execute()
    expect(result).toEqual([])
  })
})
