import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StoreCategoryEntity } from '@/store/entity/store-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CategoryWithProductPageDto,
  CreateProductDto,
  MakePurchaseDto,
  StoreProductPurchaseDto,
  UpdateProductDto,
} from '@/store/controller/dto/store.dto';
import { StoreService } from '@/store/service/store.service';
import { StoreMapper } from '@/store/mapper/store.mapper';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PurchaseService } from '@/store/service/purchase.service';

@Controller('store')
@ApiTags('store')
export class StoreController {
  constructor(
    @InjectRepository(StoreCategoryEntity)
    private readonly storeCategoryEntityRepository: Repository<StoreCategoryEntity>,
    private readonly storeService: StoreService,
    private readonly purchaseService: PurchaseService,
    private readonly mapper: StoreMapper,
  ) {}

  @Get('/category')
  public async getCategories(): Promise<CategoryWithProductPageDto[]> {
    return this.storeService
      .getCategoriesWithProductPage()
      .then((data) => data.map(this.mapper.mapCategoryWithProductPage));
  }

  @Get('/purchase')
  @ApiQuery({
    type: 'string',
    name: 'steamId',
    required: true,
  })
  public async getPurchases(
    @Query('steamId') steamId: string,
  ): Promise<StoreProductPurchaseDto[]> {
    return this.purchaseService
      .getPurchases(steamId)
      .then((items) => items.map(this.mapper.mapPurchase));
  }

  @Post('/purchase')
  public async purchaseProduct(
    @Body() dto: MakePurchaseDto,
  ): Promise<StoreProductPurchaseDto> {
    return this.purchaseService
      .purchase(dto.steamId, dto.productId)
      .then(this.mapper.mapPurchase);
  }

  // Product
  @Post('/product')
  public async createProduct(@Body() dto: CreateProductDto) {
    return this.storeService
      .createProduct(dto.category, dto.title, dto.imageKey, dto.price)
      .then(this.mapper.mapProduct);
  }

  @Patch('/product/:id')
  public async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.storeService
      .updateProduct(id, dto.category, dto.title, dto.imageKey, dto.price)
      .then(this.mapper.mapProduct);
  }

  @Delete('/product/:id')
  public async deleteProduct(@Param('id') id: string) {
    await this.storeService.deleteProduct(id);
  }
}
