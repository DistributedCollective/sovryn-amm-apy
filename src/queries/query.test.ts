/* eslint-env jest */

import { getQuery } from '../utils/apolloClient'
import { currentBlock } from './currentBlock'
import { conversionFeesByBlock } from './conversionFees'
import { liquidityPoolDataByBlock } from './liquidityPoolData'
import fetch from 'cross-fetch'

const time = 10000

describe('Run Generic Query', () => {
  const block = 3500000
  it(
    'gets current block',
    async () => {
      const result = await getQuery(currentBlock())
      console.log(result)
      const blockNumber = result._meta.block.number
      expect(blockNumber).toBeTruthy()
      expect(parseInt(blockNumber)).toBeTruthy()
    },
    time
  )

  it(
    'gets correct conversion fees by block',
    async () => {
      const result = await getQuery(conversionFeesByBlock(block))
      console.log(result)
    },
    time
  )

  it(
    'gets liquidity pools by block',
    async () => {
      const result = await getQuery(liquidityPoolDataByBlock(block))
      console.log(result)
    },
    time
  )

  it(
    'fetches test api in reasonable time',
    async () => {
      await fetch('https://graph-wrapper.sovryn.app')
        .then((data) => console.log(data))
        .catch((e) => console.error(e))
    },
    time
  )
})
