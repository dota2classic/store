import {
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { PurchaseEntity } from './purchase.entity';

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

  @OneToMany(() => PurchaseEntity, (spe) => spe.buyer)
  purchases: Relation<PurchaseEntity>[];
}
