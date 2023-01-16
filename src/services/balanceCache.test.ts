/* eslint-env jest */
import { BalanceCache } from './balanceCache'

describe('BalanceCache class', () => {
  const block = 3100000
  it('gets contract balance', async () => {
    const bc = new BalanceCache()
    const pool = '0xc2d05263318e2304fc7cdad40eea6a091b310080'
    const token = '0x6a9a07972d07e58f0daf5122d11e069288a375fb'
    const res = await bc.getContractBalance(pool, token, block)
    console.log(res)
  })
  it('gets V1 staked balance', async () => {
    const bc = new BalanceCache()
    const pool = '0x133ebe9c8ba524c9b1b601e794df527f390729bf'
    const token = '0x6a9a07972d07e58f0daf5122d11e069288a375fb'
    const res = await bc.getV1StakedBalance(pool, token, block)
    console.log(res)
  })
  it('gets V2 staked balance', async () => {
    const bc = new BalanceCache()
    const pool = '0x133ebe9c8ba524c9b1b601e794df527f390729bf'
    const token = '0x4d5a316d23ebe168d8f887b4447bf8dbfa4901cc'
    const res = await bc.getV2StakedBalance(pool, token, block)
    console.log(res)
  })
})
