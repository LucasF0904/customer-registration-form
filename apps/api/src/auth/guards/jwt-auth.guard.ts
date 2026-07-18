import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { FastifyRequest } from 'fastify'

export interface JwtPayload {
  sub: string
  email: string
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest & { user?: JwtPayload }>()

    const authHeader = request.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedException('Token ausente')

    const token = authHeader.slice(7)
    try {
      const payload = this.jwtService.verify<JwtPayload>(token)
      request.user = payload
      return true
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado')
    }
  }
}
