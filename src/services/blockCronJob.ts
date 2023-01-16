import { isNil } from 'lodash'
import { conversionFeesByBlock } from '../queries/conversionFees'
import { getQuery } from '../utils/apolloClient'
import {
  IGraphConversionFeeData,
  IAllocationPointData
} from '../types/graphQueryResults'
import { bignumber } from 'mathjs'
import { allocationPointsByBlock } from '../queries/allocationPoints'
import { getBlockTimestamp } from '../utils/getBlockTimestamp'
import { currentBlock } from '../queries/currentBlock'
import {
  ILmApyBlock,
  getLastSavedBlock,
  createBlockRow
} from '../models/apyBlock.model'
import config from '../config/config'
import log from '../logger'
import { getLiquidityPoolDataByBlock } from './helpers'

const logger = log.logger.child({ module: 'Apy Block Cronjob' })

const { errorThreshold, chunkSize } = config

export async function main (): Promise<void> {
  let startBlock = await getLastSavedBlock()
  const endBlock = await getCurrentBlock()
  const startTime = new Date().getTime()

  if (isNil(startBlock)) {
    startBlock = endBlock - chunkSize
  } else if (endBlock - startBlock > chunkSize) {
    startBlock = endBlock - chunkSize
  }

  logger.debug(`Start block: ${startBlock}; End block: ${endBlock}`)

  while (startBlock < endBlock) {
    let numErrors = 0
    try {
      logger.info('Getting all data for block %s', [startBlock])
      const data = await getDataForOneBlock(startBlock)
      logger.info('Creating database rows for block %s', [startBlock])

      const promises = data.map(async (item) => await createBlockRow(item))
      Promise.resolve(promises)
        .then(() =>
          logger.debug('Database block rows created for block %s', [startBlock])
        )
        .catch((e) => logger.error(e))
      startBlock++
    } catch (e) {
      logger.error(
        `Error getting LM APY Block data for block : ${startBlock}`,
        e
      )
      numErrors++
      if (numErrors > errorThreshold) {
        startBlock++
      }
    }
  }
  const endTime = new Date().getTime()
  const duration = (endTime - startTime) / 1000
  logger.debug('Loop finished', startBlock, endBlock, duration)
}

async function getCurrentBlock (): Promise<number> {
  const data = await getQuery(currentBlock())
  return data._meta.block.number
}

async function getDataForOneBlock (block: number): Promise<ILmApyBlock[]> {
  logger.info('Getting timestamp for block %s', [block])
  const blockTimestamp = await getBlockTimestamp(block)
  const output: ILmApyBlock[] = []
  logger.info('Getting liquidity pool data for block %s', [block])
  const { liquidityPoolData, rewardTokenAddress, rewardTokenPrice } =
    await getLiquidityPoolData(block)
  logger.info('Getting conversion fee data for block %s', [block])
  const conversionData = await getConversionFeeData(block)
  logger.info('Getting rewards data for block %s', [block])
  const rewardsData = await getRewardsData(block, rewardTokenPrice)

  for (const poolToken in liquidityPoolData) {
    if (liquidityPoolData[poolToken].balanceBtc !== '0') {
      output.push({
        block: block,
        blockTimestamp: blockTimestamp,
        poolToken: poolToken,
        pool: liquidityPoolData[poolToken].pool,
        balanceBtc: liquidityPoolData[poolToken].balanceBtc,
        conversionFeeBtc: !isNil(conversionData[poolToken])
          ? conversionData[poolToken]
          : '0',
        rewards: !isNil(rewardsData[poolToken])
          ? rewardsData[poolToken].rewards
          : '0',
        rewardsCurrency: rewardTokenAddress,
        rewardsBtc: !isNil(rewardsData[poolToken])
          ? rewardsData[poolToken].rewardsBtc
          : '0'
      })
    }
  }
  return output
}

interface LiquidityPoolData {
  [key: string]: {
    pool: string
    balanceBtc: string
  }
}

async function getLiquidityPoolData (block: number): Promise<{
  liquidityPoolData: LiquidityPoolData
  rewardTokenAddress: string
  rewardTokenPrice: string
}> {
  const liquidityPoolData = await getLiquidityPoolDataByBlock(block)

  const rewardsToken = liquidityPoolData.find(
    (item) => item.token1.symbol === 'SOV'
  )?.token1
  let rewardTokenAddress = ''
  let rewardTokenPrice = '0'
  if (!isNil(rewardsToken)) {
    rewardTokenAddress = rewardsToken.id
    rewardTokenPrice = rewardsToken.lastPriceBtc
  }
  const output: LiquidityPoolData = {}
  liquidityPoolData.forEach((item) => {
    if (item.type === 1) {
      const poolToken = item.smartToken.id
      const balanceBtc = bignumber(item.token0Balance)
        .mul(bignumber(item.token0.lastPriceBtc))
        .plus(
          bignumber(item.token1Balance).mul(bignumber(item.token1.lastPriceBtc))
        )
      output[poolToken] = {
        pool: item.id,
        balanceBtc: balanceBtc.toFixed(18)
      }
    } else if (item.type === 2) {
      /** For each token, find the pool token */
      const poolToken0 = item.poolTokens.find(
        (i) =>
          i.underlyingAssets[0].id === item.token0.id &&
          i.underlyingAssets[0].id !== item.smartToken.id
      )?.id
      const poolToken1 = item.poolTokens.find(
        (i) =>
          i.underlyingAssets[0].id === item.token1.id &&
          i.underlyingAssets[0].id !== item.smartToken.id
      )?.id
      const btcBalanceToken0 = bignumber(item.token0Balance).mul(
        bignumber(item.token0.lastPriceBtc)
      )
      const btcBalanceToken1 = bignumber(item.token1Balance).mul(
        bignumber(item.token1.lastPriceBtc)
      )
      if (!isNil(poolToken0) && !isNil(poolToken1)) {
        output[poolToken0] = {
          pool: item.id,
          balanceBtc: btcBalanceToken0.toFixed(18)
        }
        output[poolToken1] = {
          pool: item.id,
          balanceBtc: btcBalanceToken1.toFixed(18)
        }
      }
    }
  })
  return {
    liquidityPoolData: output,
    rewardTokenAddress: rewardTokenAddress,
    rewardTokenPrice: rewardTokenPrice
  }
}

interface ConversionFeeData {
  [key: string]: string
}

async function getConversionFeeData (block: number): Promise<ConversionFeeData> {
  const conversionFeeData: IGraphConversionFeeData = await getQuery(
    conversionFeesByBlock(block)
  )
  const conversions = conversionFeeData.conversions
  const output: ConversionFeeData = {}
  conversions.forEach((item) => {
    let poolToken: string = ''

    if (item.emittedBy.type === 1) {
      poolToken = item.emittedBy.smartToken.id
    } else if (item.emittedBy.type === 2) {
      const foundPoolToken = item.emittedBy.poolTokens.find(
        (i) => i.underlyingAssets[0].id === item._toToken.id
      )
      if (!isNil(foundPoolToken)) poolToken = foundPoolToken.id
    }

    const conversionFeeBtc = bignumber(item._conversionFee).mul(
      item._toToken.lastPriceBtc
    )

    if (isNil(output[poolToken])) {
      output[poolToken] = conversionFeeBtc.toFixed(18)
    } else {
      output[poolToken] = bignumber(output[poolToken])
        .plus(conversionFeeBtc)
        .toFixed(18)
    }
  })
  return output
}

interface RewardsPerBlockData {
  [key: string]: {
    rewards: string
    rewardsBtc: string
  }
}

async function getRewardsData (
  block: number,
  rewardsTokenPriceBtc: string
): Promise<RewardsPerBlockData> {
  const rewardsData: IAllocationPointData = await getQuery(
    allocationPointsByBlock(block)
  )
  const rewards = rewardsData.liquidityMiningAllocationPoints
  const rewardsPrice = bignumber(rewardsTokenPriceBtc)
  const output: RewardsPerBlockData = {}
  rewards.forEach((item) => {
    output[item.id] = {
      rewards: item.rewardPerBlock,
      rewardsBtc: bignumber(item.rewardPerBlock).mul(rewardsPrice).toFixed(18)
    }
  })
  return output
}
