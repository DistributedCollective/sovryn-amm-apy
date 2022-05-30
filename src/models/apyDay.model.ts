import { IDayData } from './apyBlock.model'
import { getRepository, MoreThan } from 'typeorm'
import { ApyDay } from '../entity'
import { isNil } from 'lodash'

export async function saveApyDayRow (data: IDayData): Promise<void> {
  const newRow = new ApyDay()
  newRow.date = new Date(data.date.setHours(0, 0, 0, 0))
  newRow.poolToken = data.pool_token
  newRow.pool = data.pool
  newRow.balanceBtc = Number(data.balance)
  newRow.feeApy = Number(data.fees_percent)
  newRow.rewardsApy = Number(data.rewards_percent)
  newRow.totalApy = Number(data.total_apy)

  /**
   * Find then update. Composite keys don't work will with upsert method
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
