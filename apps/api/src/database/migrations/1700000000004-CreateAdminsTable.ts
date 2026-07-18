import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAdminsTable1700000000004 implements MigrationInterface {
  name = 'CreateAdminsTable1700000000004'

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "admins" (
        "id"            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        "email"         VARCHAR(255) UNIQUE NOT NULL,
        "password_hash" VARCHAR(255) NOT NULL,
        "created_at"    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "admins"`)
  }
}
