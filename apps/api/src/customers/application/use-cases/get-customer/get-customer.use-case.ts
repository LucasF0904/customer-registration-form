import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import {
  ICustomerRepository,
  CUSTOMER_REPOSITORY,
} from '../../../domain/repositories/customer-repository.interface'
import { CustomerEntity } from '../../../domain/entities/customer.entity'

@Injectable()
export class GetCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(id: string): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findById(id)
    if (!customer) throw new NotFoundException('Cliente não encontrado')
    return customer
  }
}
