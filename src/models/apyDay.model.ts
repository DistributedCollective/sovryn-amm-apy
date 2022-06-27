import { ICalculatedDayData } from './apyBlock.model'
import { getRepository, MoreThan } from 'typeorm'
import { ApyDay } from '../entity'
import { isNil } from 'lodash'
import { HTTP404Error } from '../errorHandlers/baseError'

export async function saveApyDayRow (data: ICalculatedDayData): Promise<void> {
  const newRow = new ApyDay()
  newRow.date = new Date(data.date.setHours(0, 0, 0, 0))
  newRow.poolToken = data.pool_token
  newRow.pool = data.pool
  newRow.balanceBtc = Number(data.balance)
  newRow.feeApy = Number(data.fees_percent)
  newRow.rewardsApy = Number(data.rewards_percent)
  newRow.totalApy = Number(data.total_apy)

  /**
   * Find then update. Composite keys don't work well with upsert method
   */

  const repository = getRepository(ApyDay)

  const existingEntity = await repository.findOne({
    date: newRow.date,
    poolToken: newRow.poolToken
  })

  if (!isNil(existingEntity)) {
    await repository.update(
      {
        date: newRow.date,
        poolToken: newRow.poolToken
      },
      newRow
    )
  } else {
    await repository.insert(newRow)
  }
}

export async function getAllPoolData (days: number): Promise<ApyDay[]> {
  const date = new Date()
  date.setDate(date.getDate() - days)
  const repository = getRepository(ApyDay)
  const result = await repository.find({
    where: { createdAt: MoreThan(date) },
    select: [
      'pool',
      'poolToken',
      'date',
      'balanceBtc',
      'rewardsApy',
      'feeApy',
      'totalApy'
    ]
  })
  return result
}

export async function getOnePoolApy (pool: string): Promise<ApyDay[]> {
  const repository = getRepository(ApyDay)
  const result = await repository.find({
    where: { pool: pool },
    select: ['pool', 'poolToken', 'date', 'rewardsApy', 'feeApy', 'totalApy']
  })
  if (result.length > 0) {
    return result
  } else {
    throw new HTTP404Error('Pool address not found')
  }
}

export async function getOnePoolData (
  pool: string,
  days: number
): Promise<ApyDay[]> {
  const date = new Date()
  date.setDate(date.getDate() - days)
  const repository = getRepository(ApyDay)
  const result = await repository.find({
    where: { pool: pool, createdAt: MoreThan(date) },
    select: [
      'pool',
      'poolToken',
      'date',
      'balanceBtc',
      'rewardsApy',
      'feeApy',
      'totalApy'
    ]
  })
  if (result.length > 0) {
    return result
  } else {
    throw new HTTP404Error('Pool address not found')
  }
}
