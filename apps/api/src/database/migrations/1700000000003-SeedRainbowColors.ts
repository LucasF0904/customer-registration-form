import type { MigrationInterface, QueryRunner } from 'typeorm'

const RAINBOW_COLORS = [
  { name: 'Vermelho', hexCode: '#E53E3E' },
  { name: 'Laranja', hexCode: '#ED8936' },
  { name: 'Amarelo', hexCode: '#ECC94B' },
  { name: 'Verde', hexCode: '#48BB78' },
  { name: 'Azul', hexCode: '#4299E1' },
  { name: 'Anil', hexCode: '#667EEA' },
  { name: 'Violeta', hexCode: '#9F7AEA' },
]

export class SeedRainbowColors1700000000003 implements MigrationInterface {
  name = 'SeedRainbowColors1700000000003'

  async up(queryRunner: QueryRunner): Promise<void> {
    const values = RAINBOW_COLORS.map(({ name, hexCode }) => `('${name}', '${hexCode}')`).join(', ')

    await queryRunner.query(`
      INSERT INTO "colors" ("name", "hex_code")
      VALUES ${values}
      ON CONFLICT ("name") DO NOTHING
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const names = RAINBOW_COLORS.map(({ name }) => `'${name}'`).join(', ')
    await queryRunner.query(`DELETE FROM "colors" WHERE "name" IN (${names})`)
  }
}
