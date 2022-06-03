import { getAllPoolData } from '../models/apyDay.model'
import { isNil } from 'lodash'

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
    balanceHistory: Array<{
      activity_date: Date
      balance_btc: number
      pool: string
    }>
  }
}

/** TODO: Dry up this code */
export async function getAmmApyAll (days: number = 7): Promise<IAmmApyAll> {
  const rows = await getAllPoolData(days)
  const output: IAmmApyAll = {}
  for (const row of rows) {
    const poolExists = !isNil(output[row.pool])
    let poolTokenExists = false
    if (poolExists) {
      poolTokenExists = !isNil(output[row.pool].data[row.poolToken])
    }

    const dataItem = {
      pool_token: row.poolToken,
      activity_date: row.date,
      APY_fees_pc: row.feeApy,
      APY_rewards_pc: row.rewardsApy,
      APY_pc: row.totalApy
    }

    const balanceHistoryItem = {
      activity_date: row.date,
      balance_btc: row.balanceBtc,
      pool: row.pool
    }

    if (!poolExists) {
      const data: { [key: string]: any[] } = {}
      const balanceHistory = [balanceHistoryItem]
      data[row.poolToken] = [dataItem]
      output[row.pool] = {
        pool: row.pool,
        data: data,
        balanceHistory: balanceHistory
      }
    } else if (!poolTokenExists) {
      const pool = output[row.pool]
      pool.data[row.poolToken] = [dataItem]
      const existingBalanceHistory = pool.balanceHistory.findIndex(
        (item) => item.activity_date === balanceHistoryItem.activity_date
      )
      if (existingBalanceHistory === -1) {
        pool.balanceHistory.push(balanceHistoryItem)
      } else {
        pool.balanceHistory[existingBalanceHistory].balance_btc +=
          balanceHistoryItem.balance_btc
      }
    } else {
      const poolTokenData = output[row.pool].data[row.poolToken]
      poolTokenData.push(dataItem)
      const pool = output[row.pool]
      const existingBalanceHistory = pool.balanceHistory.findIndex(
        (item) => item.activity_date === balanceHistoryItem.activity_date
      )
      if (existingBalanceHistory === -1) {
        pool.balanceHistory.push(balanceHistoryItem)
      } else {
        pool.balanceHistory[existingBalanceHistory].balance_btc +=
          balanceHistoryItem.balance_btc
      }
    }
  }
  return output
}
