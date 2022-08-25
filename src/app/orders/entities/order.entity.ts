import { IsDefined, Length, IsDate, IsEnum } from 'class-validator';
import { PaymentRoute } from 'src/types';
import Product, { ProductSchema } from 'src/app/products/entities';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, VirtualType } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Schema({
  collection: 'orders',
  autoIndex: true,
  _id: false,
  // toJSON: { virtuals: true, getters: true },
  // toObject: { virtuals: true, getters: true },
})
@ObjectType()
export default class Order {
  @Prop({ type: SchemaTypes.Number })
  @Field((type) => ID, { description: 'an Order Id created in sequence' })
  _id!: number;

  @Prop({ type: SchemaTypes.Date, unique: true, required: true })
  @Field((type) => Date)
  @IsDefined()
  @IsDate()
  orderDate!: Date;

  @Prop({ type: SchemaTypes.String, required: true })
  @Field((type) => String)
  @IsDefined()
  @IsEnum(PaymentRoute)
  paymentRoute!: PaymentRoute;

  @Prop({ type: [{ type: SchemaTypes.Number }], required: true })
  orderProductIds!: number[];

  // @Prop({ type: [{ type: SchemaTypes.Number, ref: Product.name }], autopopulate: true })
  @Field((type) => [Product], { description: 'ordered products' })
  /* GraphQL array type 속성의 array item 혹은 array 전체가 필수값이 아닐 경우 아래와 같이 지정할 수 있다 */
  // @Field((type) => [Product], { nullable: 'items' | 'itemsAndList' })
  // products!: Product[];
  orderProducts!: number[];

  @Prop()
  @Field({ nullable: true, description: 'a description written by the user as customer' })
  @Length(0, 255)
  userDescription?: string;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.virtual('orderProducts', {
  localField: 'orderProductIds',
  ref: Product.name,
  foreignField: '_id',
  // autopopulate: true,
  // justOne: true
});
/* MongoDB Virtual 필드에 population이 제대로 안되거나 값을 읽을 수 없을 경우 아래 코드를 사용해보자 */
// OrderSchema.set('toObject', { virtuals: true });
// OrderSchema.set('toJSON', { virtuals: true });
