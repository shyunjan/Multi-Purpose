import Order from '../entities';
// import { OmitType } from '@nestjs/mapped-types';
import { IsDefined, Min } from 'class-validator';
import { InputType, OmitType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput extends OmitType(
  Order,
  ['_id', 'orderProducts'] as const,
  InputType
) {
  @Field((type) => [Int], { description: 'IDs of ordered products' })
  @IsDefined()
  @Min(1, { each: true })
  orderProductIds!: number[];
}
