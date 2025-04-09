import { Injectable } from '@nestjs/common';
import { StoreCategoryEntity } from '@/store/entity/store-category.entity';
import {
  CategoryWithProductPageDto,
  ProductDto,
  StoreProductPurchaseDto,
} from '@/store/controller/dto/store.dto';
import { StoreProductEntity } from '@/store/entity/store-product.entity';
import { StoreProductPurchaseEntity } from '@/store/entity/store-product-purchase.entity';

@Injectable()
export class StoreMapper {
  public mapProduct = (product: StoreProductEntity): ProductDto => ({
    id: product.id,
    price: product.price,
    title: product.title,
    imageKey: product.image,
  });

  public mapCategoryWithProductPage = (
    category: StoreCategoryEntity,
  ): CategoryWithProductPageDto => {
    return {
      category: category.category,
      products: category.products.map(this.mapProduct),
    };
  };
  public mapPurchase = (
    purchase: StoreProductPurchaseEntity,
  ): StoreProductPurchaseDto => {
    return {
      id: purchase.id,
      steamId: purchase.steamId,
      productId: purchase.productId,
    };
  };
}
