import { Entity, Column, PrimaryColumn, Index } from 'typeorm'

import { IsEthereumAddress, IsNumber } from 'class-validator'

import { AbstractBaseEntity } from './AbstractBase.entity'

@Entity()
export class ApyDay extends AbstractBaseEntity {
  @PrimaryColumn()
  date!: Date

  @PrimaryColumn()
  @IsEthereumAddress()
  poolToken!: string

  @Index()
  @Column()
  @IsEthereumAddress()
  pool!: string

  @Column('decimal', { precision: 25, scale: 18 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  balanceBtc!: number

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  feeApy!: number

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  rewardsApy!: number

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  totalApy!: number

  @Column('decimal', { precision: 25, scale: 18, default: '0' })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  btcVolume!: number
}
