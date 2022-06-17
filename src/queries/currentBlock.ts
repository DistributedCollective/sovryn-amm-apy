import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

export const currentBlock = (): DocumentNode => {
  return gql`
    {
      _meta {
        block {
          number
        }
      }
    }
  `
}
