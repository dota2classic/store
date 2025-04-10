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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CategoryDto,
  CategoryWithProductPageDto,
  CreateProductDto,
  ItemHolder,
  MakePurchaseDto,
  StoreProductPurchaseDto,
  UpdateProductDto,
} from '@/store/controller/dto/store.dto';
import { StoreService } from '@/store/service/store.service';
import { StoreMapper } from '@/store/mapper/store.mapper';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PurchaseService } from '@/store/service/purchase.service';
import { ProductCategoryEntity } from '@/store/entity/product-category.entity';

@Controller('store')
@ApiTags('store')
export class StoreController {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly storeCategoryEntityRepository: Repository<ProductCategoryEntity>,
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

  @Get('/category/list')
  public async listCategories(): Promise<CategoryDto[]> {
    return this.storeService.getCategories();
  }

  @Get('/item')
  @ApiQuery({
    type: 'string',
    name: 'steamId',
    required: true,
  })
  public async getOwnedItems(
    @Query('steamId') steamId: string,
  ): Promise<ItemHolder[]> {
    return this.purchaseService
      .getItems(steamId)
      .then((items) =>
        items.map((item) => this.mapper.mapAbstractItem(item.item)),
      );
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

  @Get('/product/:id')
  public async getProduct(@Param('id') id: string) {
    return this.storeService.getProduct(id).then(this.mapper.mapProduct);
  }

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
