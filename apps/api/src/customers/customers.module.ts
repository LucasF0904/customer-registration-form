import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CustomerTypeOrmEntity } from './infrastructure/entities/customer.typeorm-entity'
import { TypeOrmCustomerRepository } from './infrastructure/repositories/typeorm-customer.repository'
import { RegisterCustomerUseCase } from './application/use-cases/register-customer/register-customer.use-case'
import { CustomersController } from './infrastructure/http/customers.controller'
import { CUSTOMER_REPOSITORY } from './domain/repositories/customer-repository.interface'
import { ColorsModule } from '../colors/colors.module'

@Module({
  imports: [TypeOrmModule.forFeature([CustomerTypeOrmEntity]), ColorsModule],
  providers: [
    { provide: CUSTOMER_REPOSITORY, useClass: TypeOrmCustomerRepository },
    RegisterCustomerUseCase,
  ],
  controllers: [CustomersController],
})
export class CustomersModule {}
