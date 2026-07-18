import { Injectable, UnauthorizedException, Inject } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import {
  IAdminRepository,
  ADMIN_REPOSITORY,
} from '../../../domain/repositories/admin-repository.interface'

export interface LoginResult {
  token: string
  admin: { email: string }
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string): Promise<LoginResult> {
    const admin = await this.adminRepository.findByEmail(email)
    if (!admin) throw new UnauthorizedException('Credenciais inválidas')

    const valid = await argon2.verify(admin.passwordHash, password)
    if (!valid) throw new UnauthorizedException('Credenciais inválidas')

    const token = this.jwtService.sign({ sub: admin.id, email: admin.email })

    return { token, admin: { email: admin.email } }
  }
}
