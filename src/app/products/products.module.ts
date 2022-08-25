import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection, Schema } from 'mongoose';
import Product, { ProductSchema } from './entities';

@Module({
  // imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Product.name,
        useFactory: (connection: Connection): Schema => {
          const sequenceIncrement = require('mongoose-sequence')(connection);
          return ProductSchema.plugin(sequenceIncrement, {
            id: 'product_seq',
            start_seq: 1,
          });
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [MongooseModule],
})
export default class ProductsModule {}
