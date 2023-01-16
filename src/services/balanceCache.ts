import { createContract } from '../utils/contractHelper'
import abiV1 from '../config/abi/GetBalanceV1.json'
import abiV2 from '../config/abi/GetBalanceV2.json'
import abiERC20 from '../config/abi/ERC20BalanceOf.json'
import { AbiItem } from 'web3-utils'
import { bignumber, BigNumber } from 'mathjs'
import { LiquidityPoolDataItem } from '../types/graphQueryResults'
import { getQuery } from '../utils/apolloClient'
import { currentBlock } from '../queries/currentBlock'
import { getLiquidityPoolDataByBlock } from './helpers'

export interface BalanceCacheItem {
  ammPool: string
  contractBalanceToken: number
  stakedBalanceToken: number
  contractBalanceBtc: number
  stakedBalanceBtc: number
  tokenDelta: number
  btcDelta: number
}

export class BalanceCache {
  currentBlock: number
  balances: {
    [key: string]: BalanceCacheItem
  }

  constructor () {
    this.balances = {}
    this.currentBlock = 0
  }

  async initialize (): Promise<void> {
    const newBlock: number = await getQuery(currentBlock()).then(
      (res) => res._meta.block.number
    )
    await getLiquidityPoolDataByBlock(newBlock)
  }

  async handleNewLiquidityPoolData (
    block: number,
    data: LiquidityPoolDataItem[]
  ): Promise<void> {
    if (block !== this.currentBlock) {
      for (const pool of data) {
        await this.updatePoolCache(block, pool)
      }
      this.currentBlock = block
    }
  }

  getPoolCache (pool: string): BalanceCacheItem | undefined {
    return this.balances[pool]
  }

  async updatePoolCache (
    block: number,
    poolData: LiquidityPoolDataItem
  ): Promise<void> {
    const tokenAddress = poolData.token1.id
    const btcAddress = poolData.token0.id
    const stakedBalanceToken =
      poolData.type === 2
        ? await this.getV2StakedBalance(poolData.id, tokenAddress, block)
        : await this.getV1StakedBalance(poolData.id, tokenAddress, block)
    const stakedBalanceBtc =
      poolData.type === 2
        ? await this.getV2StakedBalance(poolData.id, btcAddress, block)
        : await this.getV1StakedBalance(poolData.id, btcAddress, block)

    this.balances[poolData.id] = {
      ammPool: poolData.token1.symbol,
      contractBalanceToken: Number(poolData.token1Balance),
      contractBalanceBtc: Number(poolData.token0Balance),
      stakedBalanceToken: Number(stakedBalanceToken.toFixed(18)),
      stakedBalanceBtc: Number(stakedBalanceBtc.toFixed(18)),
      tokenDelta: Number(
        bignumber(poolData.token1Balance).minus(stakedBalanceToken).toFixed(18)
      ),
      btcDelta: Number(
        bignumber(poolData.token0Balance).minus(stakedBalanceBtc).toFixed(18)
      )
    }
  }

  async getContractBalance (
    pool: string,
    token: string,
    block: number
  ): Promise<BigNumber> {
    const contract = createContract(abiERC20 as AbiItem[], token)
    const contractBalance = await contract.methods.balanceOf(pool).call(block)
    return this.convertFromWei(contractBalance)
  }

  async getV1StakedBalance (
    pool: string,
    token: string,
    block: number
  ): Promise<BigNumber> {
    const contract = createContract(abiV1 as AbiItem[], pool)
    const stakedBalance = await contract.methods
      .getConnectorBalance(token)
      .call(block)
    return this.convertFromWei(stakedBalance)
  }

  async getV2StakedBalance (
    pool: string,
    token: string,
    block: number
  ): Promise<BigNumber> {
    const contract = createContract(abiV2 as AbiItem[], pool)
    const stakedBalance = await contract.methods
      .reserveStakedBalance(token)
      .call(block)
    return this.convertFromWei(stakedBalance)
  }

  convertFromWei (rawNum: string): BigNumber {
    return bignumber(rawNum).div(1e18)
  }
}

const balanceCache = new BalanceCache()
balanceCache.initialize().catch((e) => console.log(e))

export default balanceCache
