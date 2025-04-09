import { useFullModule } from '@/@test/useFullModule';
import { PurchaseService } from '@/service/purchase.service';
import { NoBalanceException } from '@/exception/no-balance.exception';
import { NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';

describe('PurchaseService', () => {
  const [te, data] = useFullModule();

  let ps: PurchaseService;

  beforeAll(() => {
    ps = te.service(PurchaseService);
  });

  describe('Purchase products', () => {
    it('should purchase if it has money', async () => {
      // given
      const user = await data.user.createUser(500);
      const product = await data.product.createProduct(100);

      // when
      const purchase = await ps.purchase(user.steamId, product.id);

      // then
      await expect(data.user.getBalance(user.steamId)).resolves.toMatchObject({
        balance: 400,
      });

      await expect(
        data.purchase.getPurchase(purchase.id),
      ).resolves.toMatchObject({
        productId: product.id,
        steamId: user.steamId,
        purchasePrice: 100,
      });
    });

    it('should purchase zero cost if balance doesnt exist', async () => {
      const randomUser = "123452323434"
      // given
      const product = await data.product.createProduct(0);

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
      const user = await data.user.createUser(50);
      const product = await data.product.createProduct(100);

      // when + then
      await expect(ps.purchase(user.steamId, product.id)).rejects.toThrow(
        NoBalanceException,
      );
    });

    it('should not purchase if baance doesn"t exist cause no money', async () => {
      // given
      const product = await data.product.createProduct(100);

      // when + then
      await expect(ps.purchase("1234123412", product.id)).rejects.toThrow(
        NoBalanceException,
      );
    });

    it('should not purchase if no product', async () => {
      // given
      const user = await data.user.createUser(50);
      const product = await data.product.createProduct(100);

      // when + then
      await expect(ps.purchase(user.steamId, v4())).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
