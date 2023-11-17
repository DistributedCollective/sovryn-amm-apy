import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

export const poolVolumeItems = (timestamp: string): DocumentNode => (
  gql`
    {
        poolVolumeItems(where: { timestamp_gte: ${timestamp}}) {
        id
        btcAmount
        timestamp
        pool {
            id
          }
      }
      }
    `
)
