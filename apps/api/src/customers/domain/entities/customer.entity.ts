import { ColorEntity } from '../../../colors/domain/entities/color.entity'

export class CustomerEntity {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly cpfHash: string,
    readonly cpfMasked: string,
    readonly cpfFingerprint: string,
    readonly email: string,
    readonly color: ColorEntity,
    readonly createdAt: Date,
    readonly notes?: string,
  ) {}
}
