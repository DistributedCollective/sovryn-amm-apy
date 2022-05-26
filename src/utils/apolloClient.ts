import config from '../config/config'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { DocumentNode } from 'graphql'
import fetch from 'cross-fetch'
import log from '../logger'
import { isNil } from 'lodash'

const logger = log.logger.child({ module: 'Apollo Client' })

const { subgraphUrl } = config

const httpLink = createHttpLink({
  uri: subgraphUrl,
  fetch: fetch
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

/** TODO: figure out how to properly type this */
export const getQuery = async (query: DocumentNode): Promise<any> => {
  try {
    // logger.debug("Running graph query, %s", [query.loc?.source.body]);
    const res = await client.query({ query })
    // logger.debug("Result, %s", [res.data]);
    // console.debug(res);
    if (!isNil(res.data)) return res.data
    else throw new Error('Subgraph query did not return data')
  } catch (e) {
    const error = e as Error
    logger.error('Error running subgraph query, %s', [query.loc?.source.body])
    logger.error('Error: %s %s', [error.message, e])
  }
}
