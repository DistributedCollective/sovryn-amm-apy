import { Entity, Column, PrimaryColumn } from 'typeorm'

import { IsEthereumAddress, IsNumber } from 'class-validator'

import { AbstractBaseEntity } from './AbstractBase.entity'

@Entity()
export class ApyDay extends AbstractBaseEntity {
  @PrimaryColumn()
  date!: Date

  @PrimaryColumn()
  @IsEthereumAddress()
  poolToken!: string

  @Column()
  @IsEthereumAddress()
  pool!: string

  @Column('decimal', { precision: 5, scale: 2 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  balanceBtc!: number

  @Column('decimal', { precision: 5, scale: 2 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  feeApy!: number

  @Column('decimal', { precision: 5, scale: 2 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  rewardsApy!: number

  @Column('decimal', { precision: 5, scale: 2 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 18 })
  totalApy!: number
}
