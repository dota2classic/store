import { useFullModule } from '@/@test/useFullModule';
import * as request from 'supertest';
import { StoreMapper } from '@/mapper/store.mapper';

describe('StoreController', () => {
  const [te, data] = useFullModule();
  let mapper: StoreMapper;

  beforeAll(() => {
    mapper = te.service(StoreMapper);
  });

  it('should return categories with products', async () => {
    const hats = await data.category.create('hats');
    const badges = await data.category.create('badges');

    const hat = await data.product.createProduct(100, hats.category, 'Hat 1');
    const badge = await data.product.createProduct(
      50,
      badges.category,
      'Badge',
    );

    const expectedResponse = [
      { category: hat.categoryId, products: [hat] },
      { category: badge.categoryId, products: [badge] },
    ];
    await request(te.app.getHttpServer())
      .get(`/store/category`)
      .expect(200)
      .expect(
        JSON.stringify(expectedResponse.map(mapper.mapCategoryWithProductPage)),
      );
  });
});
