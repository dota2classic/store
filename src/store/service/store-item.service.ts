import { Injectable } from '@nestjs/common';
import { HatItemEntity } from '@/store/entity/item/hat-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StoreItemService {
  constructor(
    @InjectRepository(HatItemEntity)
    private readonly hatItemEntityRepository: Repository<HatItemEntity>,
  ) {}

  public async createHat(title: string, imageKey: string) {
    return this.hatItemEntityRepository.save(
      new HatItemEntity(title, imageKey),
    );
  }
}
