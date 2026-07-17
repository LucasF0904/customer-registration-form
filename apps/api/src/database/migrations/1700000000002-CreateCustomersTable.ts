import type { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCustomersTable1700000000002 implements MigrationInterface {
  name = 'CreateCustomersTable1700000000002'

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id"         UUID          NOT NULL DEFAULT gen_random_uuid(),
        "name"       VARCHAR(255)  NOT NULL,
        "cpf"        VARCHAR(11)   NOT NULL,
        "email"      VARCHAR(255)  NOT NULL,
        "color_id"   UUID          NOT NULL,
        "notes"      TEXT,
        "created_at" TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_customers_id"    PRIMARY KEY ("id"),
        CONSTRAINT "UQ_customers_cpf"   UNIQUE ("cpf"),
        CONSTRAINT "UQ_customers_email" UNIQUE ("email"),
        CONSTRAINT "FK_customers_color"
          FOREIGN KEY ("color_id") REFERENCES "colors" ("id")
          ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `)
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_customers_cpf"   ON "customers" ("cpf")`)
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_customers_email" ON "customers" ("email")`)
    await queryRunner.query(
      `CREATE INDEX "IDX_customers_created_at" ON "customers" ("created_at" DESC)`,
    )
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_customers_created_at"`)
    await queryRunner.query(`DROP INDEX "IDX_customers_email"`)
    await queryRunner.query(`DROP INDEX "IDX_customers_cpf"`)
    await queryRunner.query(`DROP TABLE "customers"`)
  }
}
