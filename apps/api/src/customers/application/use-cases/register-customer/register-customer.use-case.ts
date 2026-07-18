import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { createHmac } from 'crypto'
import * as argon2 from 'argon2'
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from '../../../domain/repositories/customer-repository.interface'
import {
  COLOR_REPOSITORY,
  IColorRepository,
} from '../../../../colors/domain/repositories/color-repository.interface'
import { isValidCpf } from '../../../../shared/validations/cpf.validation'
import { RegisterCustomerDto } from './register-customer.dto'
import { CustomerEntity } from '../../../domain/entities/customer.entity'

function cpfFingerprint(digits: string): string {
  const secret = process.env.JWT_SECRET ?? 'dev-secret-change-in-prod'
  return createHmac('sha256', secret).update(digits).digest('hex')
}

function maskCpf(digits: string): string {
  return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`
}

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

    const digits = dto.cpf.replace(/\D/g, '')
    const fingerprint = cpfFingerprint(digits)

    const [cpfExists, emailExists] = await Promise.all([
      this.customerRepository.existsByCpfFingerprint(fingerprint),
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

    const cpfHash = await argon2.hash(digits, { type: argon2.argon2id })

    return this.customerRepository.create({
      name: dto.name.trim(),
      cpfHash,
      cpfMasked: maskCpf(digits),
      cpfFingerprint: fingerprint,
      email: dto.email.toLowerCase().trim(),
      colorId: dto.colorId,
      notes: dto.notes?.trim(),
    })
  }
}
