import { TestEnvironment } from '@/@test/useFullModule';
import { UserBalanceEntity } from '@/entity/user-balance.entity';
import { StoreProductEntity } from '@/entity/store-product.entity';
import { StoreProductPurchaseEntity } from '@/entity/store-product-purchase.entity';
import { StoreCategoryEntity } from '@/entity/store-category.entity';

export interface PopulateExtensions {
  user: {
    createUser(balance: number, steamId?: string): Promise<UserBalanceEntity>;
    getBalance(steamId: string): Promise<UserBalanceEntity>;
  };

  product: {
    createProduct(
      price: number,
      category: string,
      title?: string,
      imageKey?: string,
    ): Promise<StoreProductEntity>;
  };

  category: {
    create(category: string): Promise<StoreCategoryEntity>;
  };

  purchase: {
    getPurchase(id: string): Promise<StoreProductPurchaseEntity>;
  };
}

export function createPopulate(te: TestEnvironment): PopulateExtensions {
  return {
    user: {
      createUser(
        balance: number,
        steamId = Math.round(1000000 + Math.random() * 1000000).toString(),
      ) {
        return te.repo<UserBalanceEntity>(UserBalanceEntity).save({
          balance,
          steamId,
        });
      },
      getBalance(steamId: string) {
        return te
          .repo<UserBalanceEntity>(UserBalanceEntity)
          .findOneOrFail({ where: { steamId } });
      },
    },

    category: {
      create(category: string): Promise<StoreCategoryEntity> {
        return te.repo<StoreCategoryEntity>(StoreCategoryEntity).save({
          category,
        });
      },
    },

    product: {
      createProduct(
        price: number,
        category: string,
        title = 'Product',
        image = 'public/image.png',
      ) {
        return te.repo<StoreProductEntity>(StoreProductEntity).save({
          price,
          title,
          image,
          categoryId: category,
        });
      },
    },

    purchase: {
      getPurchase(id: string): Promise<StoreProductPurchaseEntity> {
        return te
          .repo<StoreProductPurchaseEntity>(StoreProductPurchaseEntity)
          .findOneOrFail({ where: { id } });
      },
    },
  };
}
