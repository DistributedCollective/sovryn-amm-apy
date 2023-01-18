/* eslint-env jest */
import { bignumber } from 'mathjs'
import { BalanceCache } from './balanceCache'
import * as Helpers from './subgraphHelpers'

const mockGetCurrentBlock = jest.spyOn(Helpers, 'getCurrentBlock')

describe('BalanceCache class', () => {
  describe('.getContractBalance() and getStakedBalance()', () => {
    const block = 3100000
    it('gets contract balance', async () => {
      const bc = new BalanceCache()
      const pool = '0xc2d05263318e2304fc7cdad40eea6a091b310080'
      const token = '0x6a9a07972d07e58f0daf5122d11e069288a375fb'
      const res = await bc.getContractBalance(pool, token, block)
      expect(res).toEqual(bignumber('733137.457277503269916886'))
    })
    it('gets V1 staked balance', async () => {
      const bc = new BalanceCache()
      const pool = '0xc2d05263318e2304fc7cdad40eea6a091b310080'
      const token = '0x6a9a07972d07e58f0daf5122d11e069288a375fb'
      const res = await bc.getV1StakedBalance(pool, token, block)
      expect(res).toEqual(bignumber('732106.385956276102118586'))
    })
    it('gets V2 staked balance', async () => {
      const bc = new BalanceCache()
      const pool = '0x133ebe9c8ba524c9b1b601e794df527f390729bf'
      const token = '0x4d5a316d23ebe168d8f887b4447bf8dbfa4901cc'
      const res = await bc.getV2StakedBalance(pool, token, block)
      expect(res).toEqual(bignumber('477940.914642603684046617'))
    })
  })

  describe('.initialize()', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      mockGetCurrentBlock.mockImplementation(async () => {
        return await Promise.resolve(3511307)
      })
    })
    afterEach(async () => {
      jest.clearAllMocks()
    })
    it('Initializes balance cache', async () => {
      const bc = new BalanceCache()
      await bc.initialize()
      expect(Object.keys(bc.balances).length).toBe(17)
      expect(
        bc.balances['0x20d5c55c92615d416d73b34c8afed99288e99be1']
      ).toStrictEqual({
        ammPool: 'BNBs',
        contractBalanceToken: 0.38905363816916266,
        contractBalanceBtc: 0.29275066955212065,
        stakedBalanceToken: 0.3883542315322563,
        stakedBalanceBtc: 0.29249451337092414,
        tokenDelta: 0.000699406636906358,
        btcDelta: 0.000256156181196521
      })
    }, 10000)
  })
})
