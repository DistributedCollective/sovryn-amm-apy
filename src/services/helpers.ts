import { liquidityPoolDataByBlock } from '../queries/liquidityPoolData'
import {
  LiquidityPoolDataItem,
  ILiquidityPoolData
} from '../types/graphQueryResults'
import { getQuery } from '../utils/apolloClient'
import balanceCache from './balanceCache'
import log from '../logger'

const logger = log.logger.child({ module: 'services/helpers.ts' })

export const getLiquidityPoolDataByBlock = async (
  block: number
): Promise<LiquidityPoolDataItem[]> => {
  const liquidityPoolData: ILiquidityPoolData = await getQuery(
    liquidityPoolDataByBlock(block)
  )

  balanceCache
    .handleNewLiquidityPoolData(block, liquidityPoolData.liquidityPools)
    .catch((e) => {
      logger.error(e)
    })

  return liquidityPoolData.liquidityPools
}
