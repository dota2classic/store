import { Entity, OneToMany, PrimaryColumn, Relation } from 'typeorm';
import { ProductEntity } from '@/store/entity/product.entity';

@Entity('store_category')
export class ProductCategoryEntity {
  @PrimaryColumn()
  category: string;

  @OneToMany(() => ProductEntity, (spe) => spe.category)
  products: Relation<ProductEntity>[];
}
