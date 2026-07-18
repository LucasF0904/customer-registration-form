import { MigrationInterface, QueryRunner } from 'typeorm'

// JohnDoe@mail.com / Admin@123  (argon2id, m=65536 t=3 p=4)
const ADMIN_EMAIL = 'JohnDoe@mail.com'
const ADMIN_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$7mCV4fmBu9OzOqPhuhzlVg$XIBFyjN/OnzFU1Z2iaGoPY4LgOlrsgY8wotVWbhx85s'

export class SeedAdminUser1700000000005 implements MigrationInterface {
  name = 'SeedAdminUser1700000000005'

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "admins" ("email", "password_hash")
      VALUES ('${ADMIN_EMAIL}', '${ADMIN_HASH}')
      ON CONFLICT ("email") DO NOTHING
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "admins" WHERE "email" = '${ADMIN_EMAIL}'`)
  }
}
