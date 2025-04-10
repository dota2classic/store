import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { UserBalanceEntity } from '@/store/entity/user-balance.entity';
import { AbstractItemEntity } from '@/store/entity/item/abstract-item.entity';

@Entity('store_owned_item')
export class OwnedItemEntity {
  @ManyToOne(() => AbstractItemEntity, (p) => p.ownerships)
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'item_id',
  })
  item: Relation<AbstractItemEntity>;

  @PrimaryColumn({
    name: 'item_id',
    type: 'uuid',
  })
  itemId: string;

  @ManyToOne(() => UserBalanceEntity, (p) => p.purchases)
  @JoinColumn({
    referencedColumnName: 'steamId',
    name: 'steam_id',
  })
  owner: Relation<UserBalanceEntity>;

  @PrimaryColumn({
    name: 'steam_id',
  })
  steamId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  constructor(itemId: string, steamId: string) {
    this.itemId = itemId;
    this.steamId = steamId;
  }
}
