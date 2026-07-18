import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { RegisterCustomerUseCase } from '../../application/use-cases/register-customer/register-customer.use-case'
import { RegisterCustomerDto } from '../../application/use-cases/register-customer/register-customer.dto'
import { ListCustomersUseCase } from '../../application/use-cases/list-customers/list-customers.use-case'
import { ListCustomersDto } from '../../application/use-cases/list-customers/list-customers.dto'
import { GetCustomerUseCase } from '../../application/use-cases/get-customer/get-customer.use-case'
import { GetCustomerStatsUseCase } from '../../application/use-cases/get-customer-stats/get-customer-stats.use-case'
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard'
import { successResponse } from '../../../shared/response/api-response'

function toCustomerDto(customer: {
  id: string
  name: string
  cpfMasked: string
  email: string
  color: { id: string; name: string; hexCode: string }
  notes?: string
  createdAt: Date
}) {
  return {
    id: customer.id,
    name: customer.name,
    cpfMasked: customer.cpfMasked,
    email: customer.email,
    color: { id: customer.color.id, name: customer.color.name, hexCode: customer.color.hexCode },
    notes: customer.notes,
    createdAt: customer.createdAt,
  }
}

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly registerCustomerUseCase: RegisterCustomerUseCase,
    private readonly listCustomersUseCase: ListCustomersUseCase,
    private readonly getCustomerUseCase: GetCustomerUseCase,
    private readonly getCustomerStatsUseCase: GetCustomerStatsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Cadastrar novo cliente' })
  @ApiCreatedResponse({ description: 'Cliente cadastrado com sucesso' })
  @ApiConflictResponse({ description: 'CPF ou e-mail já cadastrado' })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  async register(@Body() dto: RegisterCustomerDto) {
    const customer = await this.registerCustomerUseCase.execute(dto)
    return successResponse(toCustomerDto(customer), 'Customer registered successfully')
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Estatísticas de clientes (admin)' })
  @ApiOkResponse({ description: 'Total e distribuição por cor' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  async stats() {
    const result = await this.getCustomerStatsUseCase.execute()
    return successResponse(result)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar clientes (admin)' })
  @ApiOkResponse({ description: 'Lista paginada com busca e filtro' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  async findAll(@Query() query: ListCustomersDto) {
    const { items, total } = await this.listCustomersUseCase.execute({
      page: query.page,
      limit: query.limit,
      search: query.search,
      colorId: query.colorId,
    })

    const totalPages = Math.ceil(total / query.limit)

    return {
      success: true,
      data: items.map(toCustomerDto),
      meta: { page: query.page, limit: query.limit, total, totalPages },
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Detalhe de cliente (admin)' })
  @ApiOkResponse({ description: 'Dados completos do cliente' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const customer = await this.getCustomerUseCase.execute(id)
    return successResponse(toCustomerDto(customer))
  }
}
