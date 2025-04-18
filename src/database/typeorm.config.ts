import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Entities } from './entities';
import configuration from '@/config/configuration';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const getTypeormConfig = (
  cs: ConfigService,
): PostgresConnectionOptions => {
  return {
    type: 'postgres',
    database: 'postgres',

    port: 5432,
    host: cs.get('postgres.host'),
    username: cs.get('postgres.username'),
    password: cs.get('postgres.password'),
    synchronize: false,
    entities: Entities,
    migrations: ['src/database/migrations/*.*'],
    migrationsRun: false,
    migrationsTableName: 'store_migrations',
    logging: true,
    namingStrategy: new SnakeNamingStrategy(),
  };
};

const AppDataSource = new DataSource(
  getTypeormConfig(new ConfigService(configuration('config.yaml'))),
);

export default AppDataSource;
