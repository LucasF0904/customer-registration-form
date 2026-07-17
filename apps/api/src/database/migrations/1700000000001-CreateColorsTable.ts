import type { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateColorsTable1700000000001 implements MigrationInterface {
  name = 'CreateColorsTable1700000000001'

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "colors" (
        "id"         UUID         NOT NULL DEFAULT gen_random_uuid(),
        "name"       VARCHAR(100) NOT NULL,
        "hex_code"   VARCHAR(7)   NOT NULL,
        "created_at" TIMESTAMP    NOT NULL DEFAULT now(),
        CONSTRAINT "PK_colors_id"   PRIMARY KEY ("id"),
        CONSTRAINT "UQ_colors_name" UNIQUE ("name")
      )
    `)
    await queryRunner.query(`CREATE INDEX "IDX_colors_name" ON "colors" ("name")`)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_colors_name"`)
    await queryRunner.query(`DROP TABLE "colors"`)
  }
}
