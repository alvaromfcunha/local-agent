import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialTables1726102147683 implements MigrationInterface {
    name = 'InitialTables1726102147683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "agent" ("id" SERIAL NOT NULL, "external_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "status" character varying NOT NULL, CONSTRAINT "UQ_eeffc48aafc4bdb036dfc343abe" UNIQUE ("external_id"), CONSTRAINT "PK_1000e989398c5d4ed585cf9a46f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "agent"`);
    }

}
