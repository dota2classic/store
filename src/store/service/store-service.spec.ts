import { useFullModule } from '@/@test/useFullModule';
import { StoreService } from '@/store/service/store.service';
import { ProductEntity } from '@/store/entity/product.entity';

describe('StoreService', () => {
  const [te, data] = useFullModule();

  let store: StoreService;

  beforeAll(() => {
    store = te.service(StoreService);
  });

  it('should add product items', async () => {
    // given
    const { category, hat, product, user } = await data.ready.basic();

    // when
    await store.setItemsForProduct(product.id, [hat.id]);

    // then
    const p = await te.repo(ProductEntity).findOne({
      where: { id: product.id },
      relations: ['items'],
    });

    expect(p.items).toMatchObject([hat]);
  });

  it('should remove product items', async () => {
    // given
    const { category, hat, product, user } = await data.ready.basic();
    product.items = [hat];
    await te.repo(ProductEntity).save(product);

    // when
    await store.setItemsForProduct(product.id, []);

    // then
    const p = await te.repo(ProductEntity).findOne({
      where: { id: product.id },
      relations: ['items'],
    });

    expect(p.items).toEqual([]);
  });
});
