import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { StoreItemType } from '@/gateway/shared-types/store-item-type';

@Entity('generic_store_item')
@TableInheritance({
  column: {
    name: 'type',
  },
})
export abstract class AbstractItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    enum: StoreItemType,
    enumName: 'store_item_type',
    nullable: false,
  })
  type: StoreItemType;

  @Column({
    name: 'title',
  })
  title: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
  })
  updateAt: Date;

  protected constructor(title: string) {
    this.title = title;
  }
}
