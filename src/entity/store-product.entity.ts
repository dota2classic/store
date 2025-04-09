import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn
} from "typeorm";
import { StoreProductPurchaseEntity } from "./store-product-purchase.entity";
import { StoreCategoryEntity } from"@/entity/store-category.entity"';

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
    name: "image_key"
  })
  image: string;

  @Column({
    name: 'title',
  })
  title: string;

  @OneToMany(() => StoreProductPurchaseEntity, (spe) => spe.product)
  purchases: Relation<StoreProductPurchaseEntity>[];

  @ManyToOne(() => StoreCategoryEntity, (p) => p.products)
  @JoinColumn({
    referencedColumnName: "category",
    name: "category"
  })
  category: Relation<StoreCategoryEntity>;

  @Column({
    name: "category"
  })
  categoryId: string;


  @CreateDateColumn({
    name: "created_at"
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "update_at"
  })
  updateAt: Date;
}
