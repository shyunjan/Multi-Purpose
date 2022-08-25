import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Order, { OrderDocument } from './entities';
import { CreateOrderInput, UpdateOrderInput } from './dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private order: Model<OrderDocument>) {}

  async create(createOrderInput: CreateOrderInput): Promise<OrderDocument> {
    const orderDoc: OrderDocument = new this.order(createOrderInput);

    /* Mongoose Entity(order.entity.ts)에서 @Prop({... autopopulate: true })로 설정했다면 아래 라인의 
       코드를 실행했을 때 자동으로 population 된다.*/
    // const result = await orderDoc.save();

    /* 위 라인의 코드로 자동 population하지 않으면 아래 라인의 코드로 수동 population해야 하지만 GraphQL resolver
       (orders.resolver.ts)에서 해당 subfield('orderProducts')를 조회하도록 코딩했으므로 이 코드도 주석처리한다.
       GraphQL 쿼리에서 요청하는 값만을 처리하는 것이 성능상 더 유리할 것으로 생각된다.*/
    // const result = (await orderDoc.save()).populate('orderProducts');

    return orderDoc.save();
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderInput: UpdateOrderInput) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
