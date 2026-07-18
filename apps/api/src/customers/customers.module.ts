import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CustomerTypeOrmEntity } from './infrastructure/entities/customer.typeorm-entity'
import { TypeOrmCustomerRepository } from './infrastructure/repositories/typeorm-customer.repository'
import { RegisterCustomerUseCase } from './application/use-cases/register-customer/register-customer.use-case'
import { ListCustomersUseCase } from './application/use-cases/list-customers/list-customers.use-case'
import { GetCustomerUseCase } from './application/use-cases/get-customer/get-customer.use-case'
import { GetCustomerStatsUseCase } from './application/use-cases/get-customer-stats/get-customer-stats.use-case'
import { CustomersController } from './infrastructure/http/customers.controller'
import { CUSTOMER_REPOSITORY } from './domain/repositories/customer-repository.interface'
import { ColorsModule } from '../colors/colors.module'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([CustomerTypeOrmEntity]), ColorsModule, AuthModule],
  providers: [
    { provide: CUSTOMER_REPOSITORY, useClass: TypeOrmCustomerRepository },
    RegisterCustomerUseCase,
    ListCustomersUseCase,
    GetCustomerUseCase,
    GetCustomerStatsUseCase,
  ],
  controllers: [CustomersController],
})
export class CustomersModule {}
