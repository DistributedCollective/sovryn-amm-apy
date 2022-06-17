import {
  getDailyAggregatedApy,
  IRawDayData,
  ICalculatedDayData
} from '../models/apyBlock.model'
import { saveApyDayRow } from '../models/apyDay.model'
import log from '../logger'
import { bignumber } from 'mathjs'

const logger = log.logger.child({ module: 'Apy Day Cronjob' })

export async function main (): Promise<void> {
  const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
  const rawDayData = await getDailyAggregatedApy(yesterday.toISOString())
  for (const row of rawDayData) {
    if (parseFloat(row.avg_balance) > 0) {
      console.log(row)
      const calculatedDayData = calculateDayApr(row)
      console.log(calculatedDayData)
      await saveApyDayRow(calculatedDayData)
    }
  }
  logger.info('All amm apy day data rows saved')
}

function calculateDayApr (data: IRawDayData): ICalculatedDayData {
  const feeApy = bignumber(data.sum_fees)
    .div(bignumber(data.avg_balance))
    .mul(365 * 100)
    .toFixed(2)
  const rewardsApy = bignumber(data.sum_rewards)
    .div(bignumber(data.avg_balance))
    .mul(365 * 100)
    .toFixed(2)
  const totalApy = bignumber(data.sum_fees)
    .plus(bignumber(data.sum_rewards))
    .div(bignumber(data.avg_balance))
    .mul(365 * 100)
    .toFixed(2)
  return {
    pool: data.pool,
    pool_token: data.pool_token,
    balance: bignumber(data.avg_balance).toFixed(8),
    fees_percent: feeApy,
    rewards_percent: rewardsApy,
    total_apy: totalApy,
    date: data.date
  }
}
