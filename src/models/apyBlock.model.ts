import { getRepository, getConnectionManager } from 'typeorm'
import { ApyBlock } from '../entity'
import { notEmpty } from '../utils/common'
import { isNil } from 'lodash'
export interface ILmApyBlock {
  blockTimestamp: number
  poolToken: string
  block: number
  pool: string
  balanceBtc: string
  conversionFeeBtc: string
  rewards: string
  rewardsCurrency: string
  rewardsBtc: string
}

function transformRowData (blockData: ILmApyBlock): ApyBlock {
  const date = new Date(blockData.blockTimestamp * 1000)
  const newRow = new ApyBlock()
  newRow.balanceBtc = Number(blockData.balanceBtc)
  newRow.blockTimestamp = date
  newRow.block = blockData.block
  newRow.poolToken = blockData.poolToken
  newRow.pool = blockData.pool
  newRow.conversionFeeBtc = Number(blockData.conversionFeeBtc)
  newRow.rewards = Number(blockData.rewards)
  newRow.rewardsCurrency = blockData.rewardsCurrency
  newRow.rewardsBtc = Number(blockData.rewardsBtc)
  return newRow
}

export async function createBlockRow (
  blockData: ILmApyBlock
): Promise<ApyBlock> {
  const apyBlockRepository = getRepository(ApyBlock)

  const newRow = transformRowData(blockData)

  await newRow.validateStrict()

  const result: ApyBlock = await apyBlockRepository.save(newRow)
  return result
}

export async function createMultipleBlockRows (
  blockData: ILmApyBlock[]
): Promise<ApyBlock[]> {
  const apyBlockRepository = getRepository(ApyBlock)
  const newRows = blockData.map((item) => transformRowData(item))
  const promises = newRows.map(async (item) => {
    try {
      await item.validateStrict()
      return item
    } catch (error) {
      return null
    }
  })

  const validatedApyBlocks = await Promise.all(promises)
  const filteredApyBlocks = validatedApyBlocks.filter(notEmpty)

  const result: ApyBlock[] = await apyBlockRepository.save(filteredApyBlocks)
  return result
}

export async function getLastSavedBlock (): Promise<number | null> {
  const apyBlockRepository = getRepository(ApyBlock)
  const row = await apyBlockRepository.find({
    order: {
      block: 'DESC'
    },
    select: ['block'],
    take: 1
  })
  if (!isNil(row[0])) {
    return row[0].block + 1
  } else {
    return null
  }
}

export interface IDayData {
  pool: string
  pool_token: string
  date: Date
  balance: string
  fees_percent: string
  rewards_percent: string
  total_apy: string
  count: string
  block_count: number
}

/**
 * This sql query calculates the daily APY of each AMM pool token
 * It selects from a results set average fees, rewards and balance from the ApyBlock table
 * This is less readable than doing it in javascript, but I think it is more performant
 */
export async function getDailyAggregatedApy (): Promise<IDayData[]> {
  const today = new Date().toISOString().slice(0, 10)
  const connection = getConnectionManager().get('default')
  const dayData = await connection
    .createQueryBuilder()
    .select([
      's.pool AS pool',
      's.poolToken as pool_token',
      's.date as date',
      's.balance as balance',
      /**
       * This is the average apy per block:
       * - Multiplied by blockCount to get apy for 1 day
       * - Multiplied by 365 to get apy for 1 year
       * - Multiplied by 100 to convert from decimal to percentage
       *
       * The APY is separated into apy from fees, from rewards and from both
       **/
      'round((s.fees / s.balance) * s.blockCount * 100 * 365, 2) as fees_percent',
      'round((s.rewards / s.balance) * s.blockCount * 100 * 365, 2) as rewards_percent',
      'round(((s.rewards + s.fees) / s.balance) * s.blockCount * 100 * 365, 2) as total_apy',
      /**
       * These columns are for debugging
       */
      's.count as count',
      's.blockCount as block_count'
    ])
    .from((subQuery) => {
      return subQuery
        .select([
          "string_agg(distinct pool, ',') AS pool", // The string_agg function is a workaround for not including pool in the groupBy clause
          'apy_block.poolToken AS poolToken',
          'date(apy_block.blockTimestamp) as date',
          'avg(apy_block.balanceBtc) as balance', // Average balance in btc for that day
          'avg(apy_block.conversionFeeBtc) as fees', // Average fees earned
          'avg(apy_block.rewardsBtc) as rewards', // Average rewards earned
          'count(apy_block.poolToken) as count', // Number of rows aggregated, for debugging
          'max(apy_block.block) - min(apy_block.block) + 1 as blockCount' // Number of blocks that day
        ])
        .from(ApyBlock, 'apy_block')
        .where(`date(apy_block.blockTimestamp) = '${today}'`)
        .groupBy('date(apy_block.blockTimestamp), apy_block.poolToken')
    }, 's')
    .getRawMany()
  return dayData as IDayData[]
}
