import { IsDefined, IsOptional, IsEmail, IsInt, Min, Max, IsNotEmpty, Length, Allow, IsEnum } from 'class-validator';
import { Sex } from 'src/types';

export class MemberDto {
  @IsDefined() // skipUndefinedProperties나 skipMissingProperties의 영향을 받지 않도록 한다
  @IsEmail()
  readonly loginId!: string;

  // @IsOptional()
  @Length(2, 255)
  readonly name?: string;

  @IsDefined()
  @IsNotEmpty()
  readonly password!: string;

  /**
   * 0~9: 테스터(tester) 유저,
   * 10~8999: 일반 유저(customer),
   * 9000~9899: 운영자(operator),
   * 9900~10000: 시스템 관리자(administrator)
   **/
  @Min(0)
  @Max(10000)
  userLevel: number = 0;

  // @IsOptional()
  @IsInt()
  @Min(19400101)
  @Max(99991231)
  readonly birthNo?: number;

  // @IsOptional()
  @IsEnum(Sex)
  readonly sex?: string;

  @Allow() // 적당한 decorator가 없을 때 이걸 사용하면 된다. 아무것도 쓰지 않으면 whitelist에 걸려서 필터링 당하게 된다
  readonly memo?: string;
}
