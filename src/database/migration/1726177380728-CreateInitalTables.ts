import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitalTables1726177380728 implements MigrationInterface {
    name = "CreateInitalTables1726177380728";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE EXTENSION IF NOT EXISTS vector;");
        await queryRunner.query(
            `CREATE TABLE "document" ("id" SERIAL NOT NULL, "external_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "content" character varying NOT NULL, "embedding" vector NOT NULL, "metadata" json, "agent_" integer, CONSTRAINT "UQ_cd0a3ba76592bda1236105b3228" UNIQUE ("external_id"), CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "agent" ("id" SERIAL NOT NULL, "external_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "name" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "UQ_eeffc48aafc4bdb036dfc343abe" UNIQUE ("external_id"), CONSTRAINT "PK_1000e989398c5d4ed585cf9a46f" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "document" ADD CONSTRAINT "FK_3d8d2c8f903aa34203cd13bb4ab" FOREIGN KEY ("agent_") REFERENCES "agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "document" DROP CONSTRAINT "FK_3d8d2c8f903aa34203cd13bb4ab"`,
        );
        await queryRunner.query(`DROP TABLE "agent"`);
        await queryRunner.query(`DROP TABLE "document"`);
    }
}
