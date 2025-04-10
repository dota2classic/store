import { TestEnvironment } from '@/@test/useFullModule';
import { UserBalanceEntity } from '@/store/entity/user-balance.entity';
import { PurchaseEntity } from '@/store/entity/purchase.entity';
import { HatItemEntity } from '@/store/entity/item/hat-item.entity';
import { ProductEntity } from '@/store/entity/product.entity';
import { ProductCategoryEntity } from '@/store/entity/product-category.entity';
import { StoreItemType } from '@/gateway/shared-types/store-item-type';
import { OwnedItemEntity } from '@/store/entity/owned-item.entity';

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
    ): Promise<ProductEntity>;
  };

  category: {
    create(category: string): Promise<ProductCategoryEntity>;
  };

  item: {
    createHat(title: string, image: string): Promise<HatItemEntity>;
  };

  purchase: {
    getPurchase(id: string): Promise<PurchaseEntity>;
  };

  owned: {
    getOwned(steamId: string): Promise<OwnedItemEntity[]>;
  };

  ready: {
    basic(): Promise<{
      category: ProductCategoryEntity;
      product: ProductEntity;
      hat: HatItemEntity;
      user: UserBalanceEntity;
    }>;

    forPurchase(): Promise<{
      category: ProductCategoryEntity;
      product: ProductEntity;
      hat: HatItemEntity;
      user: UserBalanceEntity;
    }>;

    userOwner(): Promise<{
      category: ProductCategoryEntity;
      product: ProductEntity;
      hat: HatItemEntity;
      user: UserBalanceEntity;
    }>;
  };
}

export function createPopulate(te: TestEnvironment): PopulateExtensions {
  const crud: Omit<PopulateExtensions, 'ready'> = {
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
      create(category: string): Promise<ProductCategoryEntity> {
        return te.repo<ProductCategoryEntity>(ProductCategoryEntity).save({
          category,
        });
      },
    },

    item: {
      createHat(title: string, image: string): Promise<HatItemEntity> {
        return te.repo<HatItemEntity>(HatItemEntity).save({
          title,
          imageKey: image,
          type: StoreItemType.HAT,
        });
      },
    },

    owned: {
      getOwned(steamId: string): Promise<OwnedItemEntity[]> {
        return te.repo(OwnedItemEntity).find({
          where: { steamId },
          relations: ['item'],
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
        return te.repo<ProductEntity>(ProductEntity).save({
          price,
          title,
          image,
          categoryId: category,
        });
      },
    },

    purchase: {
      getPurchase(id: string): Promise<PurchaseEntity> {
        return te
          .repo<PurchaseEntity>(PurchaseEntity)
          .findOneOrFail({ where: { id } });
      },
    },
  };
  return {
    ...crud,
    ready: {
      async basic(): Promise<{
        category: ProductCategoryEntity;
        product: ProductEntity;
        hat: HatItemEntity;
        user: UserBalanceEntity;
      }> {
        const category = await crud.category.create('hats');
        const product = await crud.product.createProduct(
          50,
          category.category,
          'Product 1',
          'Image 1',
        );
        const hat = await crud.item.createHat('Hat 1', 'image');
        const user = await crud.user.createUser(100, '123456789');
        return {
          category,
          product,
          user,
          hat,
        };
      },
      async forPurchase(): Promise<{
        category: ProductCategoryEntity;
        product: ProductEntity;
        hat: HatItemEntity;
        user: UserBalanceEntity;
      }> {
        const { category, product, user, hat } = await this.basic();
        product.items = [hat];
        await te.repo(ProductEntity).save(product);
        return {
          category,
          product,
          user,
          hat,
        };
      },
      async userOwner(): Promise<{
        category: ProductCategoryEntity;
        product: ProductEntity;
        hat: HatItemEntity;
        user: UserBalanceEntity;
      }> {
        const { category, product, user, hat } = await this.forPurchase();

        await te.repo(OwnedItemEntity).save({
          steamId: user.steamId,
          itemId: hat.id,
        });
        return {
          category,
          product,
          user,
          hat,
        };
      },
    },
  };
}
