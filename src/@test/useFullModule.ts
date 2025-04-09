import { Test, TestingModule } from '@nestjs/testing';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { INestApplication } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { Entities } from '@/database/entities';
import { AppModule } from '@/app.module';
import { createPopulate, PopulateExtensions } from '@/@test/populate';

interface Constructor<T> {
  new (...args: any[]): T;
}

export interface TestEnvironment {
  module: TestingModule;
  app: INestApplication;
  containers: {
    pg: StartedPostgreSqlContainer;
    // redis: StartedRedisContainer;
  };
  // ebus: EventBus;
  // ebusSpy: SpyInstance;
  service<R>(c: Constructor<R>): R;
  repo<R extends ObjectLiteral>(c: EntityClassOrSchema): Repository<R>;
}

export function useFullModule(): [TestEnvironment, PopulateExtensions] {
  jest.setTimeout(120_000);

  const te = {
    module: undefined as unknown as any,
    containers: {} as unknown as any,
    // ebus: {} as unknown as any,
    // ebusSpy: {} as unknown as any,
    app: {} as unknown as any,
    service: {} as unknown as any,
    repo: {} as unknown as any,
    // queryMocks: {},
  };

  afterEach(() => {});

  beforeAll(async () => {
    te.containers.pg = await new PostgreSqlContainer()
      .withUsername('username')
      .withPassword('password')
      .start();

    // te.containers.redis = await new RedisContainer()
    //   .withPassword("redispass")
    //   .start();

    te.module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          host: te.containers.pg.getHost(),
          port: te.containers.pg.getFirstMappedPort(),

          type: 'postgres',
          database: 'postgres',
          // logging: true,

          username: te.containers.pg.getUsername(),
          password: te.containers.pg.getPassword(),
          entities: Entities,
          synchronize: true,
          dropSchema: false,
          ssl: false,
        }),
        TypeOrmModule.forFeature(Entities),
        AppModule,
      ],
      providers: [],
    }).compile();

    te.app = await te.module.createNestApplication();

    await te.app.listen(0);

    te.service = (con) => te.module.get(con);
    te.repo = (con) => te.module.get(getRepositoryToken(con));

    // Mocks:
  });

  afterAll(async () => {
    await te.app.close();
    await te.containers.pg.stop();
  });

  return [te, createPopulate(te)];
}

export function testUser(): string {
  return Math.round(Math.random() * 1000000).toString();
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
