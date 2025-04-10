import { Injectable } from '@nestjs/common';
import {
  CategoryWithProductPageDto,
  ItemHolder,
  ProductDto,
  StoreProductPurchaseDto,
} from '@/store/controller/dto/store.dto';
import { PurchaseEntity } from '@/store/entity/purchase.entity';
import { ProductEntity } from '@/store/entity/product.entity';
import { ProductCategoryEntity } from '@/store/entity/product-category.entity';
import { AbstractItemEntity } from '@/store/entity/item/abstract-item.entity';
import { StoreItemType } from '@/gateway/shared-types/store-item-type';
import { HatItemEntity } from '@/store/entity/item/hat-item.entity';

@Injectable()
export class StoreMapper {
  public mapAbstractItem = (item: AbstractItemEntity): ItemHolder => {
    const base = { id: item.id, title: item.title };

    switch (item.type) {
      case StoreItemType.HAT:
        return {
          hat: { ...base, imageKey: (item as HatItemEntity).imageKey },
        };
    }

    return {};
  };

  public mapProduct = (product: ProductEntity): ProductDto => ({
    id: product.id,
    price: product.price,
    title: product.title,
    imageKey: product.image,
    categoryId: product.categoryId,
    items: product.items.map(this.mapAbstractItem),
  });

  public mapCategoryWithProductPage = (
    category: ProductCategoryEntity,
  ): CategoryWithProductPageDto => {
    return {
      category: category.category,
      products: category.products.map(this.mapProduct),
    };
  };
  public mapPurchase = (purchase: PurchaseEntity): StoreProductPurchaseDto => {
    return {
      id: purchase.id,
      steamId: purchase.steamId,
      productId: purchase.productId,
    };
  };
}
