import { Page } from '@/gateway/shared-types/page';

export class ProductDto {
  id: string;

  imageKey: string;
  title: string;
  price: number;
}

export class ProductPageDto extends Page<ProductDto> {
  page: number;
  perPage: number;
  pages: number;
  data: ProductDto[];
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
