import {MigrationInterface, QueryRunner} from "typeorm";

export class TestAddIndexToPool1655198439346 implements MigrationInterface {
    name = 'TestAddIndexToPool1655198439346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apy_day" ALTER COLUMN "balanceBtc" TYPE numeric(25,18)`);
        await queryRunner.query(`ALTER TABLE "apy_day" ALTER COLUMN "feeApy" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "apy_day" ALTER COLUMN "rewardsApy" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "apy_day" ALTER COLUMN "totalApy" TYPE numeric(10,2)`);
        await queryRunner.query(`CREATE INDEX "IDX_d6a4f103260922e7cdccbd3b3c" ON "apy_day" ("pool") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d6a4f103260922e7cdccbd3b3c"`);
        await queryRunner.query(`ALTER TABLE "apy_day" ALTER COLUMN "totalApy" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "apy_day" ALTER COLUMN "rewardsApy" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "apy_day" ALTER COLUMN "feeApy" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "apy_day" ALTER COLUMN "balanceBtc" TYPE numeric(5,2)`);
    }

}
