import { Controller, Get } from '@nestjs/common';
import { StoreCategoryEntity } from '@/store/entity/store-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryWithProductPageDto } from '@/store/controller/dto/store.dto';
import { StoreService } from '@/store/service/store.service';
import { StoreMapper } from '@/store/mapper/store.mapper';
import { ApiTags } from '@nestjs/swagger';

@Controller('store')
@ApiTags('store')
export class StoreController {
  constructor(
    @InjectRepository(StoreCategoryEntity)
    private readonly storeCategoryEntityRepository: Repository<StoreCategoryEntity>,
    private readonly storeService: StoreService,
    private readonly mapper: StoreMapper,
  ) {}

  @Get('/category')
  public async getCategories(): Promise<CategoryWithProductPageDto[]> {
    return this.storeService
      .getCategoriesWithProductPage()
      .then((data) => data.map(this.mapper.mapCategoryWithProductPage));
  }
}
