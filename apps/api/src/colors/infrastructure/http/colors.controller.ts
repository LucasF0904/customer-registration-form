import { Controller, Get, UseGuards } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'
import { ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger'
import { ListColorsUseCase } from '../../application/use-cases/list-colors/list-colors.use-case'
import { successResponse } from '../../../shared/response/api-response'

@ApiTags('colors')
@UseGuards(ThrottlerGuard)
@Controller('colors')
export class ColorsController {
  constructor(private readonly listColorsUseCase: ListColorsUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Listar cores disponíveis',
    description: 'Retorna todas as cores do arco-íris disponíveis para seleção no cadastro.',
  })
  @ApiOkResponse({
    description: 'Lista de cores retornada com sucesso',
    schema: {
      example: {
        success: true,
        data: [
          { id: 'uuid', name: 'Vermelho', hexCode: '#E53E3E', createdAt: '2024-01-01T00:00:00Z' },
        ],
      },
    },
  })
  async listColors() {
    const colors = await this.listColorsUseCase.execute()
    return successResponse(colors, 'Colors retrieved successfully')
  }
}
