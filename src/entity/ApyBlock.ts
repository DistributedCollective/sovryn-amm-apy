/**
 * block, blockTimestamp, pool,
 * poolToken, balanceBtc, conversionFeeBtc,
 * rewards, rewardCurrency, rewardsBtc
 */

import { Entity, Column, PrimaryColumn, Index } from 'typeorm'

import { IsDate, IsEthereumAddress, IsInt, IsNumber } from 'class-validator'

import { AbstractBaseEntity } from './AbstractBase.entity'

@Entity()
export class ApyBlock extends AbstractBaseEntity {
  @PrimaryColumn()
  @IsEthereumAddress()
  poolToken!: string

  @PrimaryColumn()
  @IsInt()
  block!: number

  @Column()
  @Index()
  @IsDate()
  blockTimestamp!: Date

  @Column()
  @IsEthereumAddress()
  pool!: string

  @Column('decimal', { precision: 25, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  balanceBtc!: number

  @Column('decimal', { precision: 25, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  conversionFeeBtc!: number

  @Column('decimal', { precision: 25, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  rewards!: number

  @Column()
  @IsEthereumAddress()
  rewardsCurrency!: string

  @Column('decimal', { precision: 25, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  rewardsBtc!: number
}
