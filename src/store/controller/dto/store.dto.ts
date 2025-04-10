import { Page } from '@/gateway/shared-types/page';

export abstract class GenericItemDto {
  id: string;
  title: string;
}

export class HatItemDto extends GenericItemDto {
  imageKey: string;
}

export class ProductDto {
  id: string;

  imageKey: string;
  title: string;
  price: number;
  categoryId: string;
}

export class ProductPageDto extends Page<ProductDto> {
  page: number;
  perPage: number;
  pages: number;
  data: ProductDto[];
}

export class CategoryDto {
  category: string;
}

export class CategoryWithProductPageDto {
  category: string;
  products: ProductDto[];
}

export class StoreProductPurchaseDto {
  id: string;
  productId: string;
  steamId: string;
}

export class MakePurchaseDto {
  steamId: string;
  productId: string;
}

export class CreateProductDto {
  category: string;
  title: string;
  imageKey: string;
  price: number;
}

export class UpdateProductDto {
  category?: string;
  title?: string;
  imageKey?: string;
  price?: number;
}
