import { ChildEntity, Column } from 'typeorm';
import { AbstractItemEntity } from '@/store/entity/item/abstract-item.entity';
import { StoreItemType } from '@/gateway/shared-types/store-item-type';

@ChildEntity(StoreItemType.HAT)
export class HatItemEntity extends AbstractItemEntity {
  @Column()
  type: StoreItemType.HAT;

  @Column({
    name: 'hat_image_key',
  })
  imageKey: string;

  constructor(title: string, imageKey: string) {
    super(title);
    this.imageKey = imageKey;
  }
}
