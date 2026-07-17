import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common'
import { RegisterCustomerUseCase } from './register-customer.use-case'
import { ICustomerRepository } from '../../../domain/repositories/customer-repository.interface'
import { IColorRepository } from '../../../../colors/domain/repositories/color-repository.interface'
import { ColorEntity } from '../../../../colors/domain/entities/color.entity'
import { CustomerEntity } from '../../../domain/entities/customer.entity'

const mockColorRepo: IColorRepository = {
  findAll: vi.fn(),
  findById: vi.fn(),
}

const mockCustomerRepo: ICustomerRepository = {
  create: vi.fn(),
  existsByCpf: vi.fn(),
  existsByEmail: vi.fn(),
}

const mockColor = new ColorEntity('color-id', 'Vermelho', '#E53E3E', new Date())

const validDto = {
  name: 'Maria Oliveira',
  cpf: '529.982.247-25',
  email: 'maria@exemplo.com',
  colorId: 'color-id',
}

describe('RegisterCustomerUseCase', () => {
  let useCase: RegisterCustomerUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    useCase = new RegisterCustomerUseCase(mockCustomerRepo, mockColorRepo)
    vi.mocked(mockCustomerRepo.existsByCpf).mockResolvedValue(false)
    vi.mocked(mockCustomerRepo.existsByEmail).mockResolvedValue(false)
    vi.mocked(mockColorRepo.findById).mockResolvedValue(mockColor)
    vi.mocked(mockCustomerRepo.create).mockResolvedValue(
      new CustomerEntity('id', validDto.name, '52998224725', validDto.email, mockColor, new Date()),
    )
  })

  it('should register a customer successfully', async () => {
    const result = await useCase.execute(validDto)
    expect(result).toBeInstanceOf(CustomerEntity)
    expect(mockCustomerRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ cpf: '52998224725', email: 'maria@exemplo.com' }),
    )
  })

  it('should throw BadRequestException for invalid CPF', async () => {
    await expect(useCase.execute({ ...validDto, cpf: '111.111.111-11' })).rejects.toThrow(
      BadRequestException,
    )
  })

  it('should throw ConflictException when CPF already exists', async () => {
    vi.mocked(mockCustomerRepo.existsByCpf).mockResolvedValue(true)
    await expect(useCase.execute(validDto)).rejects.toThrow(ConflictException)
  })

  it('should throw ConflictException when email already exists', async () => {
    vi.mocked(mockCustomerRepo.existsByEmail).mockResolvedValue(true)
    await expect(useCase.execute(validDto)).rejects.toThrow(ConflictException)
  })

  it('should throw NotFoundException when color does not exist', async () => {
    vi.mocked(mockColorRepo.findById).mockResolvedValue(null)
    await expect(useCase.execute(validDto)).rejects.toThrow(NotFoundException)
  })

  it('should normalize CPF by stripping formatting', async () => {
    await useCase.execute(validDto)
    expect(mockCustomerRepo.existsByCpf).toHaveBeenCalledWith('52998224725')
  })

  it('should normalize email to lowercase', async () => {
    await useCase.execute({ ...validDto, email: 'MARIA@EXEMPLO.COM' })
    expect(mockCustomerRepo.existsByEmail).toHaveBeenCalledWith('maria@exemplo.com')
  })

  it('should check CPF and email existence in parallel', async () => {
    const cpfSpy = vi.mocked(mockCustomerRepo.existsByCpf)
    const emailSpy = vi.mocked(mockCustomerRepo.existsByEmail)
    await useCase.execute(validDto)
    expect(cpfSpy).toHaveBeenCalledTimes(1)
    expect(emailSpy).toHaveBeenCalledTimes(1)
  })
})
