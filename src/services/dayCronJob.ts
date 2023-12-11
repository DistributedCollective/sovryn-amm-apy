import {
  getDailyAggregatedApy,
  IRawDayData,
  ICalculatedDayData
} from '../models/apyBlock.model'
import { saveApyDayRow } from '../models/apyDay.model'
import log from '../logger'
import { bignumber } from 'mathjs'
import { getPoolVolumeItems } from '../controllers/apy.controller'

const logger = log.logger.child({ module: 'Apy Day Cronjob' })

export async function main (): Promise<void> {
  const rawDayData = await getDailyAggregatedApy()

  const yesterdayTimestamp = Math.floor(
    (new Date().getTime() - 24 * 60 * 60 * 1000) / 1000
  ).toString()

  const volumeData = await getPoolVolumeItems(yesterdayTimestamp)

  // logger.debug(rawDayData)

  for (const row of rawDayData) {
    if (parseFloat(row.avg_balance) > 0) {
      const poolVolume = volumeData.find(item => item.pool === row.pool)?.btcVolume ?? '0'
      const calculatedDayData = calculateDayApr(row, poolVolume)
      await saveApyDayRow(calculatedDayData)
    }
  }
  logger.info('All amm apy day data rows saved')
}

export function calculateDayApr (data: IRawDayData, volume: string): ICalculatedDayData {
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
    date: data.date,
    btcVolume: volume
  }
}
