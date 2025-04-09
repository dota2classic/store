import { Module } from '@nestjs/common';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { getTypeormConfig } from './database/typeorm.config';
import { Entities } from './database/entities';
import { PurchaseService } from '@/service/purchase.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(config: ConfigService): TypeOrmModuleOptions {
        return {
          ...getTypeormConfig(config),
          type: 'postgres',
          migrations: ['dist/database/migrations/*.*'],
          migrationsRun: true,
          logging: undefined,
        };
      },
      imports: [],
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(Entities),
  ],
  controllers: [],
  providers: [PurchaseService],
})
export class AppModule {}
