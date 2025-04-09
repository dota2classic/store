import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { StoreProductEntity } from './store-product.entity';
import { UserBalanceEntity } from './user-balance.entity';

@Entity('store_product_purchase')
export class StoreProductPurchaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StoreProductEntity, (p) => p.purchases)
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'product_id',
  })
  product: Relation<StoreProductEntity>;

  @Column({
    name: 'product_id',
    type: 'uuid',
  })
  productId: string;

  @ManyToOne(() => UserBalanceEntity, (p) => p.purchases)
  @JoinColumn({
    referencedColumnName: 'steamId',
    name: 'steam_id',
  })
  buyer: Relation<UserBalanceEntity>;

  @Column({
    name: 'steam_id',
  })
  steamId: string;

  @Column({
    name: 'purchase_price',
    type: 'int',
  })
  purchasePrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
