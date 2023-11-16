/* eslint-env jest */

import { calculateDayApr } from './dayCronJob'

const time = 10000

const mockData1 = {
  pool: '0xpool',
  pool_token: '0xtoken',
  date: new Date(),
  avg_balance: '0.302967259580036',
  sum_fees: '0',
  sum_rewards: '0.000185849927310984'
}

const mockData2 = {
  pool: '0xpool',
  pool_token: '0xtoken',
  date: new Date(),
  avg_balance: '2.040134123912728600',
  sum_fees: '0.000000000000000000',
  sum_rewards: '0.012306271583851875'
}

const mockDataSOV = {
  pool: '0xe76ea314b32fcf641c6c57f14110c5baa1e45ff4',
  pool_token: '0x09c5faf7723b13434abdf1a65ab1b667bc02a902',
  date: new Date('2022-07-25'),
  avg_balance: '139.287876745105080807',
  sum_fees: '0.001552799096043622',
  sum_rewards: '0.109804758847796148'
}
describe('Calculate Day APR', () => {
  it(
    'calculates correct day apr',
    () => {
      const result = calculateDayApr(mockData1, '0')
      expect(result.total_apy).toBe('22.39')
    },
    time
  )
  it(
    'calculates correct day apr',
    () => {
      const result = calculateDayApr(mockData2, '0')
      expect(result.total_apy).toBe('220.17')
    },
    time
  )
  it(
    'calculates correct day apr for SOV pool',
    () => {
      const result = calculateDayApr(mockDataSOV, '0')
      expect(result.total_apy).toBe('29.18')
    },
    time
  )
})
