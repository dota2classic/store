import { Entity, OneToMany, PrimaryColumn, Relation } from 'typeorm';
import { StoreProductEntity } from '@/entity/store-product.entity';

@Entity('store_category')
export class StoreCategoryEntity {
  @PrimaryColumn()
  category: string;

  @OneToMany(() => StoreProductEntity, (spe) => spe.category)
  products: Relation<StoreProductEntity>[];
}
