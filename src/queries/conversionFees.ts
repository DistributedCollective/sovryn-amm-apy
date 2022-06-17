import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

export const conversionFeesByBlock = (block: number): DocumentNode => {
  return gql`
    {
      conversions(where: {blockNumber: ${block}}, block: {number: ${block}}) {
        _conversionFee
        _toToken {
          id
          lastPriceBtc
          lastPriceUsd
        }
        emittedBy {
          id
          type
          poolTokens {
            id
            underlyingAssets {
              id
            }
          }
          smartToken {
            id
          }
        }
      }
    }
    
  `
}
