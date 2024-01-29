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
  newRow.btcVolume = Number(data.btcVolume)

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
    where: { date: MoreThan(date) },
    select: [
      'pool',
      'poolToken',
      'date',
      'balanceBtc',
      'rewardsApy',
      'feeApy',
      'totalApy',
      'btcVolume'
    ],
    order: { date: 'ASC' }
  })
  return result
}

/**
 * Returns the most recent apy rows for this pool
 * Why does it not use findOne? The V2 pools have a separate apy for each asset
 * This is why the filtering occurs
 */
export async function getOnePoolApy (pool: string): Promise<ApyDay[]> {
  const repository = getRepository(ApyDay)
  const result = await repository.find({
    where: { pool: pool },
    select: ['pool', 'poolToken', 'date', 'rewardsApy', 'feeApy', 'totalApy', 'btcVolume'],
    order: { date: 'DESC' },
    take: 2
  })
  if (result === undefined || result.length === 0) {
    throw new HTTP404Error('Pool address not found')
  }
  /** Remove second row for V1 pools, keep for V2 pools */
  const filteredResult = result.filter(
    (item) => item.date.getUTCDay() === result[0].date.getUTCDay()
  )
  return filteredResult
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
      'totalApy',
      'btcVolume'
    ],
    order: { date: 'ASC' }
  })
  if (result.length > 0) {
    return result
  } else {
    throw new HTTP404Error('Pool address not found')
  }
}
