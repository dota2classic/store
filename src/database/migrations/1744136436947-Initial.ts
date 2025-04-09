import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1744136436947 implements MigrationInterface {
    name = 'Initial1744136436947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" integer NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_de6af3a8762c59860794f42d8f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "store_product_purchase" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" uuid NOT NULL, "steam_id" character varying NOT NULL, "purchase_price" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6d6ac1b2e01f4cfee0e85adda5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_balance" ("steam_id" character varying NOT NULL, "balance" integer NOT NULL DEFAULT '0', CONSTRAINT "CHK_45e2fef6d05b52bacd7fc48958" CHECK ("balance" >= 0), CONSTRAINT "PK_ada8a78823a4f38973a94a101d3" PRIMARY KEY ("steam_id"))`);
        await queryRunner.query(`ALTER TABLE "store_product_purchase" ADD CONSTRAINT "FK_8f0ae199192d36ebc00e10a94e1" FOREIGN KEY ("product_id") REFERENCES "store_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_product_purchase" ADD CONSTRAINT "FK_9e40d29d82af12011fb63a2610d" FOREIGN KEY ("steam_id") REFERENCES "user_balance"("steam_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_product_purchase" DROP CONSTRAINT "FK_9e40d29d82af12011fb63a2610d"`);
        await queryRunner.query(`ALTER TABLE "store_product_purchase" DROP CONSTRAINT "FK_8f0ae199192d36ebc00e10a94e1"`);
        await queryRunner.query(`DROP TABLE "user_balance"`);
        await queryRunner.query(`DROP TABLE "store_product_purchase"`);
        await queryRunner.query(`DROP TABLE "store_product"`);
    }

}
