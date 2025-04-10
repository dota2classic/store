import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { PurchaseEntity } from './purchase.entity';
import { AbstractItemEntity } from '@/store/entity/item/abstract-item.entity';
import { ProductCategoryEntity } from '@/store/entity/product-category.entity';

@Entity('store_product')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
    name: 'price',
  })
  price: number;

  @Column({
    name: 'image_key',
  })
  image: string;

  @Column({
    name: 'title',
  })
  title: string;

  @OneToMany(() => PurchaseEntity, (spe) => spe.product)
  purchases: Relation<PurchaseEntity>[];

  @ManyToMany(() => AbstractItemEntity)
  @JoinTable()
  items: Relation<AbstractItemEntity>[];

  @ManyToOne(() => ProductCategoryEntity, (p) => p.products)
  @JoinColumn({
    referencedColumnName: 'category',
    name: 'category',
  })
  category: Relation<ProductCategoryEntity>;

  @Column({
    name: 'category',
  })
  categoryId: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
  })
  updateAt: Date;
}
