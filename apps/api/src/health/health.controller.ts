import { Controller, Get } from '@nestjs/common'
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus'
import { HealthCheck } from '@nestjs/terminus'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Health check da aplicação',
    description: 'Verifica a saúde da aplicação e a conexão com o banco de dados.',
  })
  check() {
    return this.health.check([() => this.db.pingCheck('database')])
  }
}
