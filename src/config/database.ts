import { ConnectionOptions } from "typeorm";
import { ApyBlock } from "../entity";

import config, { Environment } from "./config";

const {
  postgresHost,
  postgresPort,
  postgresUser,
  postgresPassword,
  postgresDatabase,
  env,
} = config;

const dbConfig: ConnectionOptions = {
  type: "postgres",
  host: postgresHost,
  port: postgresPort,
  username: postgresUser,
  password: postgresPassword,
  database: postgresDatabase,
  entities: [ApyBlock],
  migrations: ["src/migration/**/*.ts"],
  logging: ["error", "warn"],
  synchronize: env === Environment.Development,
  cli: {
    migrationsDir: "src/migration",
  },
};

export default dbConfig;
