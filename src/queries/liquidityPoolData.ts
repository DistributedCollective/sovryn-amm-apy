import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

export const liquidityPoolDataByBlock = (block: number): DocumentNode => {
  return gql`
    {
        liquidityPools(where: {activated: true}, block: {number: ${block}}) {
            id
            type
            smartToken {
                id
            }
            poolTokens {
                id
                underlyingAssets {
                    id
                }
            }
            token0 {
                id
                lastPriceBtc
            }
            token1 {
                id
                symbol
                lastPriceBtc
            }
            token0Balance
            token1Balance
        }
    }
    
  `
}
