import { ConnectionOptions } from 'typeorm'
import { ApyBlock, ApyDay } from '../entity'

import config from './config'

const {
  postgresHost,
  postgresPort,
  postgresUser,
  postgresPassword,
  postgresDatabase
} = config

const dbConfig: ConnectionOptions = {
  type: 'postgres',
  host: postgresHost,
  port: postgresPort,
  username: postgresUser,
  password: postgresPassword,
  database: postgresDatabase,
  entities: [ApyBlock, ApyDay],
  migrations: ['src/migration/**/*.ts'],
  logging: ['error', 'warn'],
  synchronize: false,
  cli: {
    migrationsDir: 'src/migration'
  }
}

export default dbConfig
