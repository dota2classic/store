import { MigrationInterface, QueryRunner } from 'typeorm';

export class More1744202956021 implements MigrationInterface {
  name = 'More1744202956021';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "store_category" ("category" character varying NOT NULL, CONSTRAINT "PK_f4cca94ba3e9d3e5d3056df6bdf" PRIMARY KEY ("category"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_product" ADD "image_key" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_product" ADD "category" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_product" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_product" ADD "update_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_product" ADD CONSTRAINT "FK_1f94378427bd9df9f23272301a5" FOREIGN KEY ("category") REFERENCES "store_category"("category") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "store_product" DROP CONSTRAINT "FK_1f94378427bd9df9f23272301a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_product" DROP COLUMN "update_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_product" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_product" DROP COLUMN "category"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_product" DROP COLUMN "image_key"`,
    );
    await queryRunner.query(`DROP TABLE "store_category"`);
  }
}
