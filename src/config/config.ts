import convict from 'convict'
import convictFormatWithValidator from 'convict-format-with-validator'

// Add all formats
convict.addFormats(convictFormatWithValidator)

export enum Environment {
  Production = 'production',
  Development = 'development',
  Test = 'test'
}

const config = convict({
  env: {
    doc: 'The application environment.',
    format: [...Object.values(Environment)],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  appName: {
    doc: 'application name',
    format: String,
    default: 'sovryn-amm-apy',
    env: 'APP_NAME'
  },
  logLevel: {
    doc: 'application log level',
    format: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
    default: 'info',
    env: 'LOG_LEVEL'
  },
  postgresHost: {
    doc: 'postgres host',
    format: String,
    default: 'sov-postgres',
    env: 'POSTGRES_HOST'
  },
  postgresPort: {
    doc: 'postgres port',
    format: 'port',
    default: 5432,
    env: 'POSTGRES_PORT'
  },
  postgresUser: {
    doc: 'postgres user',
    format: String,
    default: 'sov-postgres',
    env: 'POSTGRES_USER'
  },
  postgresPassword: {
    doc: 'postgres password',
    format: '*',
    default: '',
    env: 'POSTGRES_PASSWORD',
    sensitive: true
  },
  postgresDatabase: {
    doc: 'postgres database',
    format: String,
    default: 'sov-amm-apy',
    env: 'POSTGRES_DB'
  },
  subgraphUrl: {
    doc: 'Url for deployed subgraph',
    format: 'url',
    default:
      'https://subgraph.test.sovryn.app/subgraphs/name/DistributedCollective/sovryn-subgraph',
    env: 'SUBGRAPH_URL'
  },
  RSKRpc: {
    doc: 'RSK node endpoint',
    format: 'url',
    default: 'https://testnet.sovryn.app/rpc',
    env: 'RSK_RPC'
  },
  chunkSize: {
    doc: 'Chunk size for blocks per loop',
    format: Number,
    default: 50,
    env: 'CHUNK_SIZE'
  },
  errorThreshold: {
    doc: 'Number of errors allowed before incrementing block number',
    format: Number,
    default: 5,
    env: 'ERROR_THRESHOLD'
  },
  maxBlockDataRetention: {
    doc: 'Maximum number of days to keep block by block apy data',
    format: Number,
    default: 2,
    env: 'MAX_BLOCK_DATA_RETENTION'
  },
  defaultDataRange: {
    doc: 'Default number of days to fetch data for',
    format: Number,
    default: 7,
    env: 'DEFAULT_DATA_RANGE'
  }
})

config.validate({ allowed: 'strict' })

export default config.getProperties()
