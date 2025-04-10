import { Injectable, NotFoundException } from '@nestjs/common';
import { UserBalanceEntity } from '../entity/user-balance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PurchaseEntity } from '../entity/purchase.entity';
import { NoBalanceException } from '../exception/no-balance.exception';
import { ProductEntity } from '@/store/entity/product.entity';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(UserBalanceEntity)
    private readonly userBalanceEntityRepository: Repository<UserBalanceEntity>,
    @InjectRepository(ProductEntity)
    private readonly storeProductEntityRepository: Repository<ProductEntity>,
    @InjectRepository(PurchaseEntity)
    private readonly storeProductPurchaseEntityRepository: Repository<PurchaseEntity>,
    private readonly ds: DataSource,
  ) {}

  public async purchase(
    steamId: string,
    productId: string,
  ): Promise<PurchaseEntity> {
    return this.ds.transaction(async (tx) => {
      await this.ds
        .createQueryBuilder()
        .insert()
        .into(UserBalanceEntity)
        .values({ steamId, balance: 0 })
        .orIgnore()
        .execute();

      const product = await tx.findOne<ProductEntity>(ProductEntity, {
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

      const purchase = await tx.save(PurchaseEntity, {
        productId: product.id,
        purchasePrice: price,
        steamId,
      });

      user.balance -= price;
      await tx.save(user);

      return purchase;
    });
  }

  public async getPurchases(steamId: string): Promise<PurchaseEntity[]> {
    return this.storeProductPurchaseEntityRepository.find({
      where: {
        steamId,
      },
      relations: ['product'],
    });
  }
}
