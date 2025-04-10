import { Injectable } from '@nestjs/common';
import {
  CategoryWithProductPageDto,
  ProductDto,
  StoreProductPurchaseDto,
} from '@/store/controller/dto/store.dto';
import { PurchaseEntity } from '@/store/entity/purchase.entity';
import { ProductEntity } from '@/store/entity/product.entity';
import { ProductCategoryEntity } from '@/store/entity/product-category.entity';

@Injectable()
export class StoreMapper {
  public mapProduct = (product: ProductEntity): ProductDto => ({
    id: product.id,
    price: product.price,
    title: product.title,
    imageKey: product.image,
    categoryId: product.categoryId,
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
