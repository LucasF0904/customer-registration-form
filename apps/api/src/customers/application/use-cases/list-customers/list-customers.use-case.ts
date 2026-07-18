import { Injectable, Inject } from '@nestjs/common'
import {
  ICustomerRepository,
  CUSTOMER_REPOSITORY,
  CustomerListParams,
  CustomerListResult,
} from '../../../domain/repositories/customer-repository.interface'

@Injectable()
export class ListCustomersUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  execute(params: CustomerListParams): Promise<CustomerListResult> {
    return this.customerRepository.findAll(params)
  }
}
