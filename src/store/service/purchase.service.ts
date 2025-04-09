import { Injectable, NotFoundException } from '@nestjs/common';
import { UserBalanceEntity } from '../entity/user-balance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StoreProductEntity } from '../entity/store-product.entity';
import { StoreProductPurchaseEntity } from '../entity/store-product-purchase.entity';
import { NoBalanceException } from '../exception/no-balance.exception';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(UserBalanceEntity)
    private readonly userBalanceEntityRepository: Repository<UserBalanceEntity>,
    @InjectRepository(StoreProductEntity)
    private readonly storeProductEntityRepository: Repository<StoreProductEntity>,
    @InjectRepository(StoreProductPurchaseEntity)
    private readonly storeProductPurchaseEntityRepository: Repository<StoreProductPurchaseEntity>,
    private readonly ds: DataSource,
  ) {}

  public async purchase(
    steamId: string,
    productId: string,
  ): Promise<StoreProductPurchaseEntity> {
    return this.ds.transaction(async (tx) => {
      await this.ds
        .createQueryBuilder()
        .insert()
        .into(UserBalanceEntity)
        .values({ steamId, balance: 0 })
        .orIgnore()
        .execute();

      const product = await tx.findOne<StoreProductEntity>(StoreProductEntity, {
        where: { id: productId },
      });

      if (!product) throw new NotFoundException('Product not found');

      const price = product.price;

      const user = await tx
        .getRepository(UserBalanceEntity)
        .createQueryBuilder('ub')
        .setLock('pessimistic_write')
        .where('ub.steamId = :steamId', { steamId })
        .getOneOrFail();

      if (user.balance < price) {
        throw new NoBalanceException();
      }

      const purchase = await tx.save(StoreProductPurchaseEntity, {
        productId: product.id,
        purchasePrice: price,
        steamId,
      });

      user.balance -= price;
      await tx.save(user);

      return purchase;
    });
  }
}
