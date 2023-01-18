import { currentBlock } from '../queries/currentBlock'
import { liquidityPoolDataByBlock } from '../queries/liquidityPoolData'
import {
  LiquidityPoolDataItem,
  ILiquidityPoolData
} from '../types/graphQueryResults'
import { getQuery } from '../utils/apolloClient'

export const getCurrentBlock = async (): Promise<number> => {
  const newBlock: number = await getQuery(currentBlock()).then(
    (res) => res._meta.block.number
  )
  return newBlock
}

export const getLiquidityPoolDataByBlock = async (
  block: number
): Promise<LiquidityPoolDataItem[]> => {
  const liquidityPoolData: ILiquidityPoolData = await getQuery(
    liquidityPoolDataByBlock(block)
  )

  return liquidityPoolData.liquidityPools
}
