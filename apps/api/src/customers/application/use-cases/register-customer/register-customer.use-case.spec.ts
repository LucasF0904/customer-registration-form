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
  existsByCpfFingerprint: vi.fn(),
  existsByEmail: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  getStats: vi.fn(),
}

const mockColor = new ColorEntity('color-id', 'Vermelho', '#E53E3E', new Date())

const mockCustomer = new CustomerEntity(
  'id',
  'Maria Oliveira',
  '$argon2id$...',
  '***.982.247-**',
  'abc123fingerprint',
  'maria@exemplo.com',
  mockColor,
  new Date(),
)

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
    vi.mocked(mockCustomerRepo.existsByCpfFingerprint).mockResolvedValue(false)
    vi.mocked(mockCustomerRepo.existsByEmail).mockResolvedValue(false)
    vi.mocked(mockColorRepo.findById).mockResolvedValue(mockColor)
    vi.mocked(mockCustomerRepo.create).mockResolvedValue(mockCustomer)
  })

  it('should register a customer successfully', async () => {
    const result = await useCase.execute(validDto)
    expect(result).toBeInstanceOf(CustomerEntity)
    expect(mockCustomerRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        cpfHash: expect.any(String),
        cpfMasked: expect.stringContaining('982'),
        cpfFingerprint: expect.any(String),
        email: 'maria@exemplo.com',
      }),
    )
  })

  it('should throw BadRequestException for invalid CPF', async () => {
    await expect(useCase.execute({ ...validDto, cpf: '111.111.111-11' })).rejects.toThrow(
      BadRequestException,
    )
  })

  it('should throw ConflictException when CPF already exists', async () => {
    vi.mocked(mockCustomerRepo.existsByCpfFingerprint).mockResolvedValue(true)
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

  it('should compute CPF fingerprint from stripped digits', async () => {
    await useCase.execute(validDto)
    expect(mockCustomerRepo.existsByCpfFingerprint).toHaveBeenCalledWith(expect.any(String))
    expect(mockCustomerRepo.existsByCpfFingerprint).toHaveBeenCalledTimes(1)
  })

  it('should normalize email to lowercase', async () => {
    await useCase.execute({ ...validDto, email: 'MARIA@EXEMPLO.COM' })
    expect(mockCustomerRepo.existsByEmail).toHaveBeenCalledWith('maria@exemplo.com')
  })

  it('should check CPF and email existence in parallel', async () => {
    const cpfSpy = vi.mocked(mockCustomerRepo.existsByCpfFingerprint)
    const emailSpy = vi.mocked(mockCustomerRepo.existsByEmail)
    await useCase.execute(validDto)
    expect(cpfSpy).toHaveBeenCalledTimes(1)
    expect(emailSpy).toHaveBeenCalledTimes(1)
  })
})
