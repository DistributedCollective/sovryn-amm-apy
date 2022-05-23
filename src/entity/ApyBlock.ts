/**
 * block, blockTimestamp, pool,
 * poolToken, balanceBtc, conversionFeeBtc,
 * rewards, rewardCurrency, rewardsBtc
 */

import { Entity, Column, PrimaryColumn } from "typeorm";

import { IsEthereumAddress, IsNumber } from "class-validator";

import { AbstractBaseEntity } from "./AbstractBase.entity";

@Entity()
export class ApyBlock extends AbstractBaseEntity {
  @PrimaryColumn()
  blockTimestamp!: Date;

  @PrimaryColumn()
  @IsEthereumAddress()
  poolToken!: string;

  @Column()
  block!: number;

  @Column()
  @IsEthereumAddress()
  pool!: string;

  @Column("decimal", { precision: 10, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  balanceBtc!: number;

  @Column("decimal", { precision: 10, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  conversionFeeBtc!: number;

  @Column("decimal", { precision: 10, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  rewards!: number;

  @Column()
  @IsEthereumAddress()
  rewardsCurrency!: string;

  @Column("decimal", { precision: 10, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  rewardsBtc!: number;
}
