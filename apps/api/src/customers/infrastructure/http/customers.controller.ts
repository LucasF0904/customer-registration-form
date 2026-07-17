import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger'
import type { RegisterCustomerUseCase } from '../../application/use-cases/register-customer/register-customer.use-case'
import type { RegisterCustomerDto } from '../../application/use-cases/register-customer/register-customer.dto'
import { successResponse } from '../../../shared/response/api-response'

@ApiTags('customers')
@UseGuards(ThrottlerGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly registerCustomerUseCase: RegisterCustomerUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastrar novo cliente',
    description:
      'Registra um cliente com nome, CPF, e-mail, cor preferida e observações opcionais. O CPF e o e-mail devem ser únicos.',
  })
  @ApiCreatedResponse({
    description: 'Cliente cadastrado com sucesso',
    schema: {
      example: {
        success: true,
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Maria Oliveira',
          cpf: '12345678909',
          email: 'maria@exemplo.com',
          color: { id: 'uuid', name: 'Vermelho', hexCode: '#E53E3E' },
          notes: 'Cliente VIP',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        message: 'Customer registered successfully',
      },
    },
  })
  @ApiConflictResponse({
    description: 'CPF ou e-mail já cadastrado',
    schema: {
      example: {
        success: false,
        error: { code: 'CONFLICT', message: 'Já existe um cadastro com este CPF.' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou CPF com dígito verificador incorreto',
    schema: {
      example: {
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Validation failed',
          details: ['O nome é obrigatório', 'E-mail inválido'],
        },
      },
    },
  })
  async register(@Body() dto: RegisterCustomerDto) {
    const customer = await this.registerCustomerUseCase.execute(dto)
    return successResponse(
      {
        id: customer.id,
        name: customer.name,
        cpf: customer.cpf,
        email: customer.email,
        color: {
          id: customer.color.id,
          name: customer.color.name,
          hexCode: customer.color.hexCode,
        },
        notes: customer.notes,
        createdAt: customer.createdAt,
      },
      'Customer registered successfully',
    )
  }
}
