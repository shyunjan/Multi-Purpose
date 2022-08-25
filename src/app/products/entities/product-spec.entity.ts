import { Length, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PhysicalSpec, PartsSpec } from '.';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ProductSpec {
  @Field({ nullable: true })
  @Length(1, 255)
  spec?: string;

  @Field((type) => PhysicalSpec, { nullable: true })
  @ValidateNested()
  @Type(() => PhysicalSpec)
  physical?: PhysicalSpec;

  @Field((type) => PartsSpec, { nullable: true })
  @ValidateNested()
  @Type(() => PartsSpec)
  parts?: PartsSpec;
}
