import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import {
  CUSTOMER_REPOSITORY,
  type ICustomerRepository,
} from '../../../domain/repositories/customer-repository.interface'
import {
  COLOR_REPOSITORY,
  type IColorRepository,
} from '../../../../colors/domain/repositories/color-repository.interface'
import { isValidCpf } from '../../../../shared/validations/cpf.validation'
import type { RegisterCustomerDto } from './register-customer.dto'
import type { CustomerEntity } from '../../../domain/entities/customer.entity'

@Injectable()
export class RegisterCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(COLOR_REPOSITORY)
    private readonly colorRepository: IColorRepository,
  ) {}

  async execute(dto: RegisterCustomerDto): Promise<CustomerEntity> {
    if (!isValidCpf(dto.cpf)) {
      throw new BadRequestException('CPF inválido. Verifique os dígitos verificadores.')
    }

    const normalizedCpf = dto.cpf.replace(/\D/g, '')

    const [cpfExists, emailExists] = await Promise.all([
      this.customerRepository.existsByCpf(normalizedCpf),
      this.customerRepository.existsByEmail(dto.email.toLowerCase()),
    ])

    if (cpfExists) {
      throw new ConflictException('Já existe um cadastro com este CPF.')
    }

    if (emailExists) {
      throw new ConflictException('Já existe um cadastro com este e-mail.')
    }

    const color = await this.colorRepository.findById(dto.colorId)
    if (!color) {
      throw new NotFoundException('Cor não encontrada.')
    }

    return this.customerRepository.create({
      name: dto.name.trim(),
      cpf: normalizedCpf,
      email: dto.email.toLowerCase().trim(),
      colorId: dto.colorId,
      notes: dto.notes?.trim(),
    })
  }
}
