import {
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { StoreProductPurchaseEntity } from './store-product-purchase.entity';

@Entity('user_balance')
@Check('"balance" >= 0')
export class UserBalanceEntity {
  @PrimaryColumn({
    name: 'steam_id',
    unique: true,
  })
  steamId: string;

  @Column({
    name: 'balance',
    type: 'int',
    default: 0,
  })
  balance: number;

  @OneToMany(() => StoreProductPurchaseEntity, (spe) => spe.buyer)
  purchases: Relation<StoreProductPurchaseEntity>[];
}
