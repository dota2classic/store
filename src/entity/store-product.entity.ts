import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { StoreProductPurchaseEntity } from './store-product-purchase.entity';

@Entity('store_product')
export class StoreProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
    name: 'price',
  })
  price: number;

  @Column({
    name: 'title',
  })
  title: string;

  @OneToMany(() => StoreProductPurchaseEntity, (spe) => spe.product)
  purchases: Relation<StoreProductPurchaseEntity>[];
}
