import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import configuration from '../config/configuration';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Entities } from "./entities";

export const getTypeormConfig = (
  cs: ConfigService,
): PostgresConnectionOptions => {
  return {
    type: "postgres",
    database: "postgres",

    port: 5432,
    host: cs.get("postgres.host"),
    username: cs.get("postgres.username"),
    password: cs.get("postgres.password"),
    synchronize: false,
    entities: Entities,
    migrations: ["src/database/migrations/*.*"],
    migrationsRun: false,
    migrationsTableName: "store_migrations",
    logging: true,
  };
};

const AppDataSource = new DataSource(
  getTypeormConfig(new ConfigService(configuration("config.yaml"))),
);

export default AppDataSource;
