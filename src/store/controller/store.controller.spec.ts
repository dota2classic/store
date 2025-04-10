import { useFullModule } from '@/@test/useFullModule';
import * as request from 'supertest';
import { StoreMapper } from '@/store/mapper/store.mapper';
import { ProductEntity } from '@/store/entity/product.entity';

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

  it('should return product with items', async () => {
    // given
    const { product, hat } = await data.ready.basic();
    product.items = [hat];
    await te.repo(ProductEntity).save(product);

    // when + then
    await request(te.app.getHttpServer())
      .get(`/store/product/${product.id}`)
      .expect(200)
      .expect(JSON.stringify(mapper.mapProduct(product)));
  });
});
