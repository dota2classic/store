import { UserBalanceEntity } from '@/store/entity/user-balance.entity';
import { PurchaseEntity } from '@/store/entity/purchase.entity';
import { HatItemEntity } from '@/store/entity/item/hat-item.entity';
import { ProductEntity } from '@/store/entity/product.entity';
import { ProductCategoryEntity } from '@/store/entity/product-category.entity';
import { AbstractItemEntity } from '@/store/entity/item/abstract-item.entity';
import { OwnedItemEntity } from '@/store/entity/owned-item.entity';

export const Entities = [
  UserBalanceEntity,
  ProductEntity,
  PurchaseEntity,
  ProductCategoryEntity,
  HatItemEntity,
  AbstractItemEntity,
  OwnedItemEntity,
];
