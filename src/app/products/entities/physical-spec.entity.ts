import { IsNumber, IsEnum } from 'class-validator';
import { SizeUnit, WeightUnit, VolumeUnit } from 'src/types';
import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class PhysicalSpec {
  @Field((type) => Float, { nullable: true })
  @IsNumber()
  length?: number;

  @Field((type) => Float, { nullable: true })
  @IsNumber()
  width?: number;

  @Field((type) => Float, { nullable: true })
  @IsNumber()
  height?: number;

  @Field((type) => Float, { nullable: true })
  @IsNumber()
  depth?: number;

  @Field((type) => Float, { nullable: true })
  @IsNumber()
  thickness?: number;

  @Field((type) => String, { nullable: true })
  @IsEnum(SizeUnit)
  sizeUnit?: SizeUnit;

  @Field((type) => Float, { nullable: true })
  @IsNumber()
  weight?: number;

  @Field((type) => String, { nullable: true })
  @IsEnum(WeightUnit)
  weightUnit?: WeightUnit;

  @Field((type) => Float, { nullable: true })
  @IsNumber()
  volume?: number;

  @Field((type) => String, { nullable: true })
  @IsEnum(VolumeUnit)
  volumeUnit?: VolumeUnit;
}
