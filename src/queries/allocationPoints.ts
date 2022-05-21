import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

export const allocationPointsByBlock = (block: number): DocumentNode => {
  return gql`
    {
        liquidityMiningAllocationPoints (block: {number: ${block}})  {
            id
            allocationPoint
            rewardPerBlock
        }
    }
  `
}
