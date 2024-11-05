import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRunTable1726196000145 implements MigrationInterface {
    name = "CreateRunTable1726196000145";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "run" ("id" SERIAL NOT NULL, "external_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "question" character varying NOT NULL, "output" character varying NOT NULL, "is_errored" boolean NOT NULL, "agent_" integer, CONSTRAINT "UQ_d1e618e125773ef6c4ff51b7d9b" UNIQUE ("external_id"), CONSTRAINT "PK_804c38ffba92002c6d2c646dd46" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "run" ADD CONSTRAINT "FK_9c53f9ccc7ad2f13b0a2df97283" FOREIGN KEY ("agent_") REFERENCES "agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "run" DROP CONSTRAINT "FK_9c53f9ccc7ad2f13b0a2df97283"`,
        );
        await queryRunner.query(`DROP TABLE "run"`);
    }
}
