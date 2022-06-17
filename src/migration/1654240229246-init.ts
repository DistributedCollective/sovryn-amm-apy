import { MigrationInterface, QueryRunner } from 'typeorm'

export class init1654240229246 implements MigrationInterface {
  name = 'init1654240229246'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "apy_block" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "poolToken" character varying NOT NULL, "block" integer NOT NULL, "blockTimestamp" TIMESTAMP NOT NULL, "pool" character varying NOT NULL, "balanceBtc" numeric(25,18) NOT NULL, "conversionFeeBtc" numeric(25,18) NOT NULL, "rewards" numeric(25,18) NOT NULL, "rewardsCurrency" character varying NOT NULL, "rewardsBtc" numeric(25,18) NOT NULL, CONSTRAINT "PK_eb2cfdb97c74340b9e23cf643b0" PRIMARY KEY ("poolToken", "block"))')
    await queryRunner.query('CREATE INDEX "IDX_a7006b670e165330a2ca2a2ecb" ON "apy_block" ("blockTimestamp") ')
    await queryRunner.query('CREATE TABLE "apy_day" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "date" TIMESTAMP NOT NULL, "poolToken" character varying NOT NULL, "pool" character varying NOT NULL, "balanceBtc" numeric(5,2) NOT NULL, "feeApy" numeric(5,2) NOT NULL, "rewardsApy" numeric(5,2) NOT NULL, "totalApy" numeric(5,2) NOT NULL, CONSTRAINT "PK_4f339d84aa06d6340db5b5818fa" PRIMARY KEY ("date", "poolToken"))')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "apy_day"')
    await queryRunner.query('DROP INDEX "public"."IDX_a7006b670e165330a2ca2a2ecb"')
    await queryRunner.query('DROP TABLE "apy_block"')
  }
}
