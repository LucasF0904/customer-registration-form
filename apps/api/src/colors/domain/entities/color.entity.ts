export class ColorEntity {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly hexCode: string,
    readonly createdAt: Date,
  ) {}
}
