import { Module } from '@nestjs/common';
import { StoreController } from '@/store/controller/store.controller';
import { StoreMapper } from '@/store/mapper/store.mapper';
import { StoreService } from '@/store/service/store.service';
import { PurchaseService } from '@/store/service/purchase.service';
import { Entities } from '@/database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature(Entities)],
  controllers: [StoreController],
  providers: [PurchaseService, StoreService, StoreMapper],
})
export class StoreModule {}
