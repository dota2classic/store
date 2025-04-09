import { Injectable, NotFoundException } from '@nestjs/common';
import { StoreCategoryEntity } from '@/store/entity/store-category.entity';
import { StoreProductEntity } from '@/store/entity/store-product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StoreProductPurchaseEntity } from '@/store/entity/store-product-purchase.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreCategoryEntity)
    private readonly storeCategoryEntityRepository: Repository<StoreCategoryEntity>,
    @InjectRepository(StoreProductEntity)
    private readonly storeProductEntityRepository: Repository<StoreProductEntity>,
    @InjectRepository(StoreProductPurchaseEntity)
    private readonly storeProductPurchaseEntityRepository: Repository<StoreProductPurchaseEntity>,
    private readonly ds: DataSource,
  ) {}

  public async getCategoriesWithProductPage(): Promise<StoreCategoryEntity[]> {
    return this.storeCategoryEntityRepository.find({
      relations: ['products'],
    });
  }

  public async createProduct(
    category: string,
    title: string,
    imageKey: string,
    price: number,
  ): Promise<StoreProductEntity> {
    return this.storeProductEntityRepository.save({
      categoryId: category,
      title,
      image: imageKey,
      price,
    });
  }

  public async updateProduct(
    id: string,
    category?: string,
    title?: string,
    imageKey?: string,
    price?: number,
  ) {
    return this.ds.transaction(async (tx) => {
      const updates = await tx
        .getRepository(StoreProductEntity)
        .update(
          { id },
          { categoryId: category, title, image: imageKey, price },
        );

      if (!updates.affected) {
        throw new NotFoundException();
      }

      return tx
        .getRepository(StoreProductEntity)
        .findOneOrFail({ where: { id } });
    });
  }

  public async deleteProduct(id: string) {
    await this.ds.transaction(async (tx) => {
      await tx
        .getRepository(StoreProductPurchaseEntity)
        .delete({ productId: id });
      await tx.getRepository(StoreProductEntity).delete({ id });
    });
  }
}
