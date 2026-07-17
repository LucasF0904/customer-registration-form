import { ColorEntity } from '../../../colors/domain/entities/color.entity'

export class CustomerEntity {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly cpf: string,
    readonly email: string,
    readonly color: ColorEntity,
    readonly createdAt: Date,
    readonly notes?: string,
  ) {}
}
