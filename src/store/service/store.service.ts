import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { PurchaseEntity } from '@/store/entity/purchase.entity';
import { AbstractItemEntity } from '@/store/entity/item/abstract-item.entity';
import { ProductCategoryEntity } from '@/store/entity/product-category.entity';
import { ProductEntity } from '@/store/entity/product.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly storeCategoryEntityRepository: Repository<ProductCategoryEntity>,
    @InjectRepository(ProductEntity)
    private readonly storeProductEntityRepository: Repository<ProductEntity>,
    @InjectRepository(PurchaseEntity)
    private readonly storeProductPurchaseEntityRepository: Repository<PurchaseEntity>,
    private readonly ds: DataSource,
  ) {}

  public async getCategoriesWithProductPage(): Promise<
    ProductCategoryEntity[]
  > {
    return this.storeCategoryEntityRepository.find({
      relations: ['products'],
    });
  }

  public async createProduct(
    category: string,
    title: string,
    imageKey: string,
    price: number,
  ): Promise<ProductEntity> {
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
        .getRepository(ProductEntity)
        .update(
          { id },
          { categoryId: category, title, image: imageKey, price },
        );

      if (!updates.affected) {
        throw new NotFoundException();
      }

      return tx.getRepository(ProductEntity).findOneOrFail({ where: { id } });
    });
  }

  public async setItemsForProduct(id: string, itemIds: string[]) {
    await this.ds.transaction(async (tx) => {
      const items = await tx.findBy<AbstractItemEntity>(AbstractItemEntity, {
        id: In(itemIds),
      });
      if (items.length !== itemIds.length) {
        throw new NotFoundException('No such items');
      }
      const t = await tx.findOneBy<ProductEntity>(ProductEntity, { id });
      t.items = items;
      await tx.save(t);
    });
  }

  public async deleteProduct(id: string) {
    await this.ds.transaction(async (tx) => {
      await tx.getRepository(PurchaseEntity).delete({ productId: id });
      await tx.getRepository(ProductEntity).delete({ id });
    });
  }

  public async getCategories() {
    return this.storeCategoryEntityRepository.find();
  }

  public async getProduct(id: string) {
    return this.storeProductEntityRepository.findOne({
      where: { id },
      relations: ['items'],
    });
  }
}
