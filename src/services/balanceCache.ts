import { createContract } from '../utils/contractHelper'
import abiV1 from '../config/abi/GetBalanceV1.json'
import abiV2 from '../config/abi/GetBalanceV2.json'
import abiERC20 from '../config/abi/ERC20BalanceOf.json'
import { AbiItem } from 'web3-utils'
import { bignumber, BigNumber } from 'mathjs'
import { LiquidityPoolDataItem } from '../types/graphQueryResults'

export interface BalanceCacheItem {
  contractBalanceToken: number
  stakedBalanceToken: number
  contractBalanceBtc: number
  stakedBalanceBtc: number
  tokenDelta: number
  btcDelta: number
}

export class BalanceCache {
  balances: {
    [key: string]: BalanceCacheItem
  }

  constructor () {
    this.balances = {}
  }

  async handleNewLiquidityPoolData (
    block: number,
    data: LiquidityPoolDataItem[]
  ): Promise<void> {
    for (const pool of data) {
      await this.updatePoolCache(block, pool)
    }
  }

  getPoolCache (pool: string): BalanceCacheItem | undefined {
    return this.balances[pool]
  }

  async updatePoolCache (
    block: number,
    poolData: LiquidityPoolDataItem
  ): Promise<void> {
    const tokenAddress = poolData.token0.id
    const btcAddress = poolData.token1.id
    const stakedBalanceToken =
      poolData.type === 2
        ? await this.getV2StakedBalance(poolData.id, tokenAddress, block)
        : await this.getV1StakedBalance(poolData.id, tokenAddress, block)
    const stakedBalanceBtc =
      poolData.type === 2
        ? await this.getV2StakedBalance(poolData.id, btcAddress, block)
        : await this.getV1StakedBalance(poolData.id, btcAddress, block)

    this.balances[poolData.id] = {
      contractBalanceToken: Number(poolData.token0Balance),
      contractBalanceBtc: Number(poolData.token1Balance),
      stakedBalanceToken: Number(stakedBalanceToken.toFixed(18)),
      stakedBalanceBtc: Number(stakedBalanceBtc.toFixed(18)),
      tokenDelta: Number(
        bignumber(poolData.token0Balance).minus(stakedBalanceToken).toFixed(18)
      ),
      btcDelta: Number(
        bignumber(poolData.token1Balance).minus(stakedBalanceBtc).toFixed(18)
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

export default new BalanceCache()
