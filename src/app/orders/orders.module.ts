import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection, Schema } from 'mongoose';
import Order, { OrderSchema } from './entities';
import { ProductsService } from '../products/products.service';
import ProductsModule from '../products/products.module';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forFeatureAsync([
      {
        name: Order.name,
        useFactory: (connection: Connection): Schema => {
          const sequenceIncrement = require('mongoose-sequence')(connection);
          return OrderSchema.plugin(sequenceIncrement, {
            id: 'order_seq',
            start_seq: 1,
          });
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [OrdersResolver, OrdersService, ProductsService],
})
export default class OrdersModule {}
