import { PartialType } from '@nestjs/mapped-types';
import { CreateHelperDto } from './create-helper.dto';
import { IsInt } from 'class-validator';

export class UpdateHelperDto extends PartialType(CreateHelperDto) {
  @IsInt()
  id!: number;
}
