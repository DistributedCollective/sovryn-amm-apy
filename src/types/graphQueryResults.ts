export interface IGraphConversionFeeData {
  conversions: ConversionFeeDataItem[]
}

interface ConversionFeeDataItem {
  blockNumber: number
  _conversionFee: string
  _toToken: {
    symbol: string
    id: string
    lastPriceBtc: string
    lastPriceUsd: string
  }
  emittedBy: {
    id: string
    type: number
    poolTokens: Array<{
      id: string
      underlyingAssets: Array<{
        id: string
      }>
    }>
    smartToken: {
      id: string
    }
  }
}

export interface ILiquidityPoolData {
  liquidityPools: LiquidityPoolDataItem[]
}

export interface LiquidityPoolDataItem {
  id: string
  type: number
  smartToken: {
    id: string
  }
  poolTokens: Array<{
    id: string
    underlyingAssets: Array<{
      id: string
    }>
  }>
  token0: {
    id: string
    lastPriceBtc: string
    symbol: string
  }
  token1: {
    id: string
    lastPriceBtc: string
    symbol: string
  }
  token0Balance: string
  token1Balance: string
}

export interface IAllocationPointData {
  liquidityMiningAllocationPoints: AllocationPointDataItem[]
}

interface AllocationPointDataItem {
  id: string
  allocationPoint: string
  rewardPerBlock: string
}
