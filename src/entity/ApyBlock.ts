/**
 * block, blockTimestamp, pool,
 * poolToken, balanceBtc, conversionFeeBtc,
 * rewards, rewardCurrency, rewardsBtc
 */

import { Entity, Column, PrimaryColumn } from 'typeorm'

import { IsEthereumAddress } from 'class-validator'

import { AbstractBaseEntity } from './AbstractBase.entity'

@Entity()
export class User extends AbstractBaseEntity {
  @PrimaryColumn()
  blockTimestamp!: number

  @PrimaryColumn()
  @IsEthereumAddress()
  poolToken!: string

  @Column()
  block!: number

  @Column()
  @IsEthereumAddress()
  pool!: string

  @Column()
  balanceBtc!: number

  @Column()
  conversionFeeBtc!: number

  @Column()
  rewards!: number

  @Column()
  @IsEthereumAddress()
  rewardsCurrency!: string

  @Column()
  rewardsBtc!: number
}
