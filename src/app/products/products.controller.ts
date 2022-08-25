import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ParseArrayPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import Product, { ProductDocument } from './entities';
import { UpdateProduct } from './dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  async create(@Body() createProductDto: Product): Promise<ProductDocument> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[]) {
    return this.productsService.findAll(ids);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductDocument | null> {
    return this.productsService.findOne(+id);
  }

  @Patch('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProduct
  ): Promise<ProductDocument | null> {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ deletedCount: number }> {
    return this.productsService.remove(+id);
  }
}
