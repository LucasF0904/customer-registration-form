import { MigrationInterface, QueryRunner } from 'typeorm'
import { createHmac } from 'crypto'
import * as argon2 from 'argon2'

function maskCpf(digits: string): string {
  return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`
}

export class EncryptCustomerCpf1700000000006 implements MigrationInterface {
  name = 'EncryptCustomerCpf1700000000006'

  async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns (nullable during migration)
    await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN "cpf_hash" TEXT`)
    await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN "cpf_masked" VARCHAR(20)`)
    await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN "cpf_fingerprint" VARCHAR(64)`)

    // Migrate existing plain-text CPF data
    const existing = (await queryRunner.query(`SELECT id, cpf FROM "customers"`)) as {
      id: string
      cpf: string
    }[]

    const secret = process.env.JWT_SECRET ?? 'dev-secret-change-in-prod'

    for (const row of existing) {
      const digits = row.cpf.replace(/\D/g, '')
      const [cpfHash, fingerprint] = await Promise.all([
        argon2.hash(digits, { type: argon2.argon2id }),
        Promise.resolve(createHmac('sha256', secret).update(digits).digest('hex')),
      ])
      const masked = maskCpf(digits)

      await queryRunner.query(
        `UPDATE "customers" SET cpf_hash = $1, cpf_fingerprint = $2, cpf_masked = $3 WHERE id = $4`,
        [cpfHash, fingerprint, masked, row.id],
      )
    }

    // Set NOT NULL after population
    await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "cpf_hash" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "cpf_masked" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "cpf_fingerprint" SET NOT NULL`)

    // Drop old unique index on cpf column and the column itself
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_cpf" CASCADE`)
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "cpf"`)

    // Add unique constraint on fingerprint
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "UQ_customers_cpf_fingerprint" UNIQUE ("cpf_fingerprint")`,
    )
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT IF EXISTS "UQ_customers_cpf_fingerprint"`,
    )
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN IF EXISTS "cpf_fingerprint"`)
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN IF EXISTS "cpf_masked"`)
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN IF EXISTS "cpf_hash"`)
    await queryRunner.query(
      `ALTER TABLE "customers" ADD COLUMN "cpf" VARCHAR(11) NOT NULL DEFAULT ''`,
    )
  }
}
