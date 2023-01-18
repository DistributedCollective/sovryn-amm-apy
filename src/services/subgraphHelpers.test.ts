/* eslint-env jest */
import { getLiquidityPoolDataByBlock } from './subgraphHelpers'
import balanceCache from './balanceCache'

const mockHandleData = jest.spyOn(balanceCache, 'handleNewLiquidityPoolData')
describe('getLiquidityPoolDataByBlock()', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockHandleData.mockImplementation(async () => {
      return await Promise.resolve(console.log('Mock handle data'))
    })
  })
  afterEach(async () => {
    jest.clearAllMocks()
  })
  it('Returns correct array length of liquidity pool data', async () => {
    const data = await getLiquidityPoolDataByBlock(3100000)
    expect(data.length).toBe(16)
  })
})
