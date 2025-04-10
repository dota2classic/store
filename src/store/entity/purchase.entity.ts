import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { UserBalanceEntity } from './user-balance.entity';
import { ProductEntity } from '@/store/entity/product.entity';

@Entity('store_product_purchase')
export class PurchaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductEntity, (p) => p.purchases)
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'product_id',
  })
  product: Relation<ProductEntity>;

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
