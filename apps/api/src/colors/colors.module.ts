import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ColorTypeOrmEntity } from './infrastructure/entities/color.typeorm-entity'
import { TypeOrmColorRepository } from './infrastructure/repositories/typeorm-color.repository'
import { ListColorsUseCase } from './application/use-cases/list-colors/list-colors.use-case'
import { ColorsController } from './infrastructure/http/colors.controller'
import { COLOR_REPOSITORY } from './domain/repositories/color-repository.interface'

@Module({
  imports: [TypeOrmModule.forFeature([ColorTypeOrmEntity])],
  providers: [{ provide: COLOR_REPOSITORY, useClass: TypeOrmColorRepository }, ListColorsUseCase],
  controllers: [ColorsController],
  exports: [COLOR_REPOSITORY],
})
export class ColorsModule {}
