import {
  getAllPoolData,
  getOnePoolApy,
  getOnePoolData
} from '../models/apyDay.model'
import { isNil } from 'lodash'
import { ApyDay } from '../entity/ApyDay'
import { bignumber } from 'mathjs'
import config from '../config/config'

const { defaultDataRange } = config

interface IAmmApyAll {
  [key: string]: {
    pool: string
    data: {
      [key: string]: Array<{
        pool_token: string
        activity_date: Date
        APY_fees_pc: number
        APY_rewards_pc: number
        APY_pc: number
      }>
    }
    balanceHistory: BalanceHistory
  }
}

type BalanceHistory = Array<{
  activity_date: Date
  balance_btc: number | string
  pool: string
}>

function updateBalanceHistory (
  row: ApyDay,
  balanceHistory: BalanceHistory
): BalanceHistory {
  const balanceHistoryItem = {
    activity_date: row.date,
    balance_btc: row.balanceBtc,
    pool: row.pool
  }
  const balanceHistoryIndex = balanceHistory.findIndex(
    (item) =>
      item.activity_date.toISOString() ===
      balanceHistoryItem.activity_date.toISOString()
  )
  if (balanceHistoryIndex === -1) {
    balanceHistory.push(balanceHistoryItem)
  } else {
    balanceHistory[balanceHistoryIndex].balance_btc = bignumber(
      balanceHistory[balanceHistoryIndex].balance_btc
    )
      .plus(bignumber(balanceHistoryItem.balance_btc))
      .valueOf()
  }
  return balanceHistory
}

function parseApyHistoryData (data: ApyDay[]): IAmmApyAll {
  const output: IAmmApyAll = {}
  for (const row of data) {
    const poolExists = !isNil(output[row.pool])
    const poolTokenExists =
      poolExists && !isNil(output[row.pool].data[row.poolToken])

    const dataItem = {
      pool_token: row.poolToken,
      activity_date: row.date,
      APY_fees_pc: row.feeApy,
      APY_rewards_pc: row.rewardsApy,
      APY_pc: row.totalApy
    }

    if (!poolExists && !poolTokenExists) {
      const data: { [key: string]: any[] } = {}
      const balanceHistory = updateBalanceHistory(row, [])
      data[row.poolToken] = [dataItem]
      output[row.pool] = {
        pool: row.pool,
        data: data,
        balanceHistory: balanceHistory
      }
    } else {
      const pool = output[row.pool]
      const newBalanceHistory = updateBalanceHistory(row, pool.balanceHistory)
      pool.balanceHistory = newBalanceHistory
    }

    if (poolExists && !poolTokenExists) {
      const pool = output[row.pool]
      pool.data[row.poolToken] = [dataItem]
    } else {
      const poolTokenData = output[row.pool].data[row.poolToken]
      poolTokenData.push(dataItem)
    }
  }
  return output
}

export async function getAmmApyAll (
  days: number = defaultDataRange
): Promise<IAmmApyAll> {
  const rows = await getAllPoolData(days)
  const output = parseApyHistoryData(rows)
  return output
}

export async function getPoolData (
  pool: string,
  days: number = defaultDataRange
): Promise<IAmmApyAll> {
  const rows = await getOnePoolData(pool, days)
  const output = parseApyHistoryData(rows)
  return output
}

export async function getPoolApyToday (pool: string): Promise<ApyDay[]> {
  const result = await getOnePoolApy(pool)
  return result.filter(
    (item) =>
      item.date.toISOString() ===
      new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
  )
}
