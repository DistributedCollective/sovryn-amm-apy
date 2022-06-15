import { DeleteResult, getRepository, LessThan } from 'typeorm'
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

export interface ICalculatedDayData {
  pool: string
  pool_token: string
  date: Date
  balance: string
  fees_percent: string
  rewards_percent: string
  total_apy: string
}

export interface IRawDayData {
  pool: string
  pool_token: string
  date: Date
  avg_balance: string
  sum_fees: string
  sum_rewards: string
}

/** This function can be used to aggregate apy over any period (eg daily or rolling 24 hours) */
export async function getDailyAggregatedApy (
  startDate: string
): Promise<IRawDayData[]> {
  const apyBlockRepository = getRepository(ApyBlock)
  const dayData = await apyBlockRepository
    .createQueryBuilder()
    .select([
      "string_agg(distinct apy_block.pool, ',') AS pool", // The string_agg function is a workaround for not including pool in the groupBy clause
      'apy_block.poolToken AS pool_token',
      'date(apy_block.blockTimestamp) as date',
      'avg(apy_block.balanceBtc) as avg_balance', // Average balance in btc for that day
      'sum(apy_block.conversionFeeBtc) as sum_fees', // Average fees earned
      'sum(apy_block.rewardsBtc) as sum_rewards', // Average rewards earned
      'count(apy_block.poolToken) as count' // Number of rows aggregated, for debugging
    ])
    .from(ApyBlock, 'apy_block')
    .where(`date(apy_block.blockTimestamp) >= '${startDate}'`)
    .groupBy('date(apy_block.blockTimestamp), apy_block.poolToken')
    .getRawMany()
  return dayData as IRawDayData[]
}

export async function dataCleanup (maxAge: Date): Promise<DeleteResult> {
  const apyBlockRepository = getRepository(ApyBlock)
  const result = await apyBlockRepository.delete({
    blockTimestamp: LessThan(maxAge.toISOString())
  })
  return result
}
