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
