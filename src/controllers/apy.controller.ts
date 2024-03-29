import {
  getAllPoolData,
  getOnePoolApy,
  getOnePoolData
} from '../models/apyDay.model'
import { isNil } from 'lodash'
import { ApyDay } from '../entity/ApyDay'
import { bignumber } from 'mathjs'
import config from '../config/config'
import balanceCache from '../services/balanceCache'
import { PoolBalanceResponse } from '../types/apiResponseData'
import { HTTP404Error } from '../errorHandlers/baseError'
import { poolVolumeItems } from '../queries/poolVolumeItems'
import { IPoolVolumeItems } from '../types/graphQueryResults'
import { getQuery } from '../utils/apolloClient'

const { defaultDataRange } = config

export interface IPoolVolumeResult {
  pool: string
  btcVolume: string
}

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
        btc_volume: number
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
      APY_pc: row.totalApy,
      btc_volume: row.btcVolume
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
  return result
}

export async function getPoolBalanceData (
  pool: string
): Promise<PoolBalanceResponse> {
  const balanceData = balanceCache.getPoolCache(pool)
  if (balanceData === undefined) {
    throw new HTTP404Error('Pool not found')
  }
  const apyData = await getOnePoolApy(pool)
  return {
    ...balanceData,
    yesterdayApy: apyData.map((item) => {
      return {
        pool: item.pool,
        pool_token: item.poolToken,
        activity_date: item.date,
        apy: item.totalApy
      }
    })
  }
}

export const getPoolVolumeItems = async (timestamp: string): Promise<IPoolVolumeResult[]> => {
  const poolVolumeItemsData: IPoolVolumeItems = await getQuery(poolVolumeItems(timestamp))

  const data = poolVolumeItemsData.poolVolumeItems

  let result: IPoolVolumeResult[] = []

  data.forEach((item) => {
    const poolId = item.pool.id
    const btcAmount = bignumber(item.btcAmount)

    const poolInArray = result.find(item => item.pool === poolId)

    if (poolInArray !== undefined) {
      // If the poolId already exists, add to the existing sum
      const updatedItem = { pool: poolInArray.pool, btcVolume: btcAmount.add(poolInArray.btcVolume).toFixed(18) }
      const updatedArray = result.map(item => {
        if (item.pool === updatedItem.pool) {
          return updatedItem
        }
        return item
      })

      result = updatedArray
    } else {
      // If the poolId does not exist, create a new entry
      result.push({ pool: poolId, btcVolume: btcAmount.toFixed(18) })
    }
  })

  return result
}
