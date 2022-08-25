// import { IntersectionType, PickType, PartialType } from '@nestjs/mapped-types';
import { InputType, IntersectionType, PickType, PartialType } from '@nestjs/graphql';
import Order from '../entities';
import { CreateOrderInput } from '.';

@InputType()
export class UpdateOrderInput extends IntersectionType(
  PickType(Order, ['_id'] as const),
  PartialType(CreateOrderInput),
  InputType
) {
  // @Field(() => Int)
  // id: number;
}
