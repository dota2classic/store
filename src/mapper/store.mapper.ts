import { Injectable } from '@nestjs/common';
import { StoreCategoryEntity } from '@/entity/store-category.entity';
import {
  CategoryWithProductPageDto,
  ProductDto,
} from '@/controller/dto/store.dto';
import { StoreProductEntity } from '@/entity/store-product.entity';

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
}
