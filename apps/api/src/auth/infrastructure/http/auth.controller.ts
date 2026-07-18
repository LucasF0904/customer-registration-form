import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { LoginUseCase } from '../../application/use-cases/login/login.use-case'
import { LoginDto } from '../../application/dtos/login.dto'
import { successResponse } from '../../../shared/response/api-response'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login de administrador',
    description: 'Retorna um JWT para acesso ao backoffice.',
  })
  @ApiCreatedResponse({
    description: 'Login realizado com sucesso',
    schema: {
      example: {
        success: true,
        data: { token: 'eyJhbGci...', admin: { email: 'JohnDoe@mail.com' } },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  async login(@Body() dto: LoginDto) {
    const result = await this.loginUseCase.execute(dto.email, dto.password)
    return successResponse(result, 'Login realizado com sucesso')
  }
}
