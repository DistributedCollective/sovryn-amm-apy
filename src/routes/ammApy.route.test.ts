/* eslint-env jest */
import app from '../app'
import request from 'supertest'
import { examplePoolBalanceResponse } from '../types/apiResponseData'
import { ApyDay } from '../entity'

jest.mock('../services/balanceCache.ts', () => {
  const originalBalanceCache = jest.requireActual(
    '../services/balanceCache.ts'
  )
  return {
    _esModule: true,
    balances: {
      '0xefc78fc7d48b64958315949279ba181c2114abbd': {
        ammPool: 'testAmmPool',
        contractBalanceToken: 1,
        stakedBalanceToken: 2,
        contractBalanceBtc: 3,
        stakedBalanceBtc: 4,
        tokenDelta: 5,
        btcDelta: 6
      }
    },
    getPoolCache: jest
      .fn()
      .mockImplementation(originalBalanceCache.default.getPoolCache)
  }
})

jest.mock('../models/apyDay.model.ts', () => ({
  getOnePoolApy: jest.fn().mockImplementation(async () => {
    const item1 = new ApyDay()
    item1.pool = 'testPool'
    item1.poolToken = 'testPoolToken'
    item1.date = new Date()
    item1.rewardsApy = 0.04
    item1.feeApy = 0.03
    item1.totalApy = 0.035
    return await Promise.resolve([item1])
  })
}))

const alphabeticalSort = (a: string, b: string): number => (a > b ? 1 : -1)

describe('GET /pool-balance/:pool', () => {
  afterEach(async () => {
    jest.clearAllMocks()
  })
  it('Returns correct data format', async () => {
    const result = await request(app)
      .get('/amm/pool-balance/0xefc78fc7d48b64958315949279ba181c2114abbd')
      .send()
    const expectedKeys = Object.keys(examplePoolBalanceResponse)
    expect(result.status).toBe(200)
    expect(Object.keys(result.body).sort(alphabeticalSort)).toEqual(
      expectedKeys.sort(alphabeticalSort)
    )
    const expectedYesterdayApyKeys = Object.keys(
      examplePoolBalanceResponse.yesterdayApy[0]
    )
    expect(
      Object.keys(result.body.yesterdayApy[0]).sort(alphabeticalSort)
    ).toEqual(expectedYesterdayApyKeys.sort(alphabeticalSort))
  }, 10000)
})
