import {MigrationInterface, QueryRunner} from "typeorm";

export class PoolVolumeBtc1699977094694 implements MigrationInterface {
    name = 'PoolVolumeBtc1699977094694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apy_day" ADD "btcVolume" numeric(25,18) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apy_day" DROP COLUMN "btcVolume"`);
    }

}
