/* eslint-env jest */
import app from '../app'
import request from 'supertest'
import { examplePoolBalanceResponse } from '../types/apiResponseData'

const alphabeticalSort = (a: string, b: string): number =>
  a[0] > b[0] ? 1 : -1

describe('GET /pool-balance/:pool', () => {
  it('Returns correct data format', async () => {
    const result = await request(app).get('/amm/pool-balance/SOV').send()
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
  })
})
