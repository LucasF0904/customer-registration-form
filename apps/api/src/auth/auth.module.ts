import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AdminTypeOrmEntity } from './infrastructure/entities/admin.typeorm-entity'
import { TypeOrmAdminRepository } from './infrastructure/repositories/typeorm-admin.repository'
import { LoginUseCase } from './application/use-cases/login/login.use-case'
import { AuthController } from './infrastructure/http/auth.controller'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { ADMIN_REPOSITORY } from './domain/repositories/admin-repository.interface'

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminTypeOrmEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'change-me-in-production'),
        signOptions: { expiresIn: '8h' as const },
      }),
    }),
  ],
  providers: [
    { provide: ADMIN_REPOSITORY, useClass: TypeOrmAdminRepository },
    LoginUseCase,
    JwtAuthGuard,
  ],
  controllers: [AuthController],
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
