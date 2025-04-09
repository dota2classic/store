import { Injectable } from '@nestjs/common';
import { StoreCategoryEntity } from '@/entity/store-category.entity';
import { StoreProductEntity } from '@/entity/store-product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreCategoryEntity)
    private readonly storeCategoryEntityRepository: Repository<StoreCategoryEntity>,
    @InjectRepository(StoreProductEntity)
    private readonly storeProductEntityRepository: Repository<StoreProductEntity>,
    private readonly ds: DataSource,
  ) {}

  public async getCategoriesWithProductPage(): Promise<StoreCategoryEntity[]> {
    return this.storeCategoryEntityRepository.find({
      relations: ['products'],
    });
  }
}
