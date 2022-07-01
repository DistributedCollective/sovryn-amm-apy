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
describe('Calculate Day APR', () => {
  it(
    'calculates correct day apr',
    () => {
      const result = calculateDayApr(mockData1)
      expect(result.total_apy).toBe('22.39')
    },
    time
  )
  it(
    'calculates correct day apr',
    () => {
      const result = calculateDayApr(mockData2)
      expect(result.total_apy).toBe('220.17')
    },
    time
  )
})
