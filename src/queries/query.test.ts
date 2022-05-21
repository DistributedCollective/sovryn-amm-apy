/* eslint-env jest */

import { getQuery } from '../utils/apolloClient'
import { currentBlock } from './currentBlock'
import { conversionFeesByBlock } from './conversionFees'

describe('Run Generic Query', () => {
  it('gets current block', async () => {
    const result = await getQuery(currentBlock())
    console.log(result)
    const blockNumber = result._meta.block.number
    expect(blockNumber).toBeTruthy()
    expect(parseInt(blockNumber)).toBeTruthy()
  })

  it('gets correct conversion fees by block', async () => {
    const result = await getQuery(conversionFeesByBlock(2406628))
    console.log(result)
  })
})
