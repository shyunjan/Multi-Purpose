import { Color, Currency } from 'src/types';
import { ProductSpec } from '.';
import { IsDefined, IsInt, Length, IsEnum, ValidateNested, min, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@Schema({ collection: 'products', _id: false })
@ObjectType()
export default class Product {
  @Prop({ type: SchemaTypes.Number })
  @Field((type) => Int)
  // @IsDefined()
  // @Min(1)
  _id!: number;

  @Prop({ required: true })
  @Field()
  @IsDefined()
  @Length(3, 64)
  productName!: string;

  @Prop()
  @Field({ nullable: true })
  @Length(0, 255)
  option?: string;

  @Prop({ type: SchemaTypes.Mixed })
  @Field((type) => ProductSpec, { nullable: true })
  // @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => ProductSpec)
  spec?: ProductSpec;

  @Prop({ required: true })
  @Field((type) => Int)
  @IsDefined()
  @IsInt()
  price!: number;

  @Prop({ type: SchemaTypes.String, required: true })
  @Field((type) => String)
  @IsDefined()
  @IsEnum(Currency)
  currency!: Currency;

  @Prop({ type: SchemaTypes.String })
  @Field((type) => String, { nullable: true })
  @IsEnum(Color)
  color?: Color;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
