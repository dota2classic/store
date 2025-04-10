import { useFullModule } from '@/@test/useFullModule';
import { PurchaseService } from '@/store/service/purchase.service';
import { NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { NoBalanceException } from '@/store/exception/no-balance.exception';
import { OwnedItemEntity } from '@/store/entity/owned-item.entity';

describe('PurchaseService', () => {
  const [te, data] = useFullModule();

  let ps: PurchaseService;

  beforeAll(() => {
    ps = te.service(PurchaseService);
  });

  describe('Purchase products', () => {
    it('should purchase if it has money', async () => {
      // given
      const { category, user, hat, product } = await data.ready.forPurchase();
      const startingBalance = user.balance;

      // when
      const purchase = await ps.purchase(user.steamId, product.id);

      // then

      // balance updated
      await expect(data.user.getBalance(user.steamId)).resolves.toMatchObject({
        balance: startingBalance - product.price,
      });

      // purchase created
      await expect(
        data.purchase.getPurchase(purchase.id),
      ).resolves.toMatchObject({
        productId: product.id,
        steamId: user.steamId,
        purchasePrice: product.price,
      });

      // Item ownership created
      await expect(data.owned.getOwned(user.steamId)).resolves.toEqual(
        expect.arrayContaining([
          expect.objectContaining<Partial<OwnedItemEntity>>({
            itemId: hat.id,
            steamId: user.steamId,
          }),
        ]),
      );
    });

    it('should purchase zero cost if balance doesnt exist', async () => {
      const randomUser = '123452323434';
      // given
      const category = await data.category.create('cat');
      const product = await data.product.createProduct(0, category.category);

      // when
      const purchase = await ps.purchase(randomUser, product.id);

      // then
      await expect(data.user.getBalance(randomUser)).resolves.toMatchObject({
        balance: 0,
      });

      await expect(
        data.purchase.getPurchase(purchase.id),
      ).resolves.toMatchObject({
        productId: product.id,
        steamId: randomUser,
        purchasePrice: 0,
      });
    });

    it('should not purchase if no money', async () => {
      // given
      const category = await data.category.create('cat');
      const user = await data.user.createUser(50);
      const product = await data.product.createProduct(100, category.category);

      // when + then
      await expect(ps.purchase(user.steamId, product.id)).rejects.toThrow(
        NoBalanceException,
      );
    });

    it('should not purchase if baance doesn"t exist cause no money', async () => {
      // given
      const category = await data.category.create('cat');
      const product = await data.product.createProduct(100, category.category);

      // when + then
      await expect(ps.purchase('1234123412', product.id)).rejects.toThrow(
        NoBalanceException,
      );
    });

    it('should not purchase if no product', async () => {
      // given
      const category = await data.category.create('cat');
      const user = await data.user.createUser(50);
      const product = await data.product.createProduct(100, category.category);

      // when + then
      await expect(ps.purchase(user.steamId, v4())).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
