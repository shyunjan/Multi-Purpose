import { IsDefined, IsNumberString } from 'class-validator';

export class FindIdParams {
  @IsDefined()
  @IsNumberString()
  id!: number;
}
