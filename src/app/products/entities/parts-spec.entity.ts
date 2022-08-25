import { Length, IsNumber, IsEnum } from 'class-validator';
import { DataVolumeUnit, DataProcessingUnit } from 'src/types';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class PartsSpec {
  @Field((type) => Int, { nullable: true })
  @IsNumber()
  memorySize?: number;

  @Field((type) => String, { nullable: true })
  @IsEnum(DataVolumeUnit)
  memorySizeUnit?: DataVolumeUnit;

  @Field({ nullable: true })
  @Length(0, 127)
  cpu?: string;

  @Field((type) => Float, { nullable: true })
  @IsNumber()
  cpuSpeed?: number;

  @Field((type) => String, { nullable: true })
  @IsEnum(DataProcessingUnit)
  cpuSpeedUnit?: DataProcessingUnit;
}
