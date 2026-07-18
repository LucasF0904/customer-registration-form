import { Injectable, Inject } from '@nestjs/common'
import {
  ICustomerRepository,
  CUSTOMER_REPOSITORY,
  CustomerStatsResult,
} from '../../../domain/repositories/customer-repository.interface'

@Injectable()
export class GetCustomerStatsUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  execute(): Promise<CustomerStatsResult> {
    return this.customerRepository.getStats()
  }
}
