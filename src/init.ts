import {
  ValidationPipeOptions,
  Controller,
  Inject,
  Post,
  Body,
  ParseArrayPipe,
} from '@nestjs/common';
import { MemberDto } from './app/auth/dto';
import { AuthService } from './app/auth/auth.service';
import { SessionType } from './types';

/**
 * tsconfig-paths 모듈은 ts-node가 실행시에 typescript 소스의 절대 경로를 찾지 못하기 때문에 필요하다.
 * 아래 공식 사이트를 참고하자. 단, 공식 사이트 소스에 약간 잘못된 부분이 있어서 아래와 같이 수정해야 한다.
 * https://www.npmjs.com/package/tsconfig-paths
 *
 * package.json 파일의 "scripts"에서 "... -r tsconfig-paths/register " 옵션을 사용하여 실행할 경우는 아래 코드를
 * 실행할 필요가 없다. 또한 아래 코드를 통하여 typescript 소스 경로를 등록하는 방식으로 하려면 tsconfig-paths 모듈
 * 설치를 "devDependencies"가 아닌 "dependencies"로 옮겨야 하므로 일단 사용하지 않는다.
 **/
// require('tsconfig-paths').register({
//   baseUrl: require('path').resolve(__dirname, '../'),
//   paths: { '*': ['*'] },
// });

export const defaultValidationOptions: ValidationPipeOptions = {
  always: false,
  transform: true,
  whitelist: true,
  // forbidNonWhitelisted: true,
  // forbidUnknownValues: true,
  skipUndefinedProperties: true,
  // skipMissingProperties: true,
};

/* 아래 컨트롤러는 Super User 계정을 등록하기 위함s */
@Controller('initSys')
export class InitiateSystemController {
  constructor(private readonly authService: AuthService) {}

  /* User(tester, operator, administrator except customer)를 memory-db에 저장 */
  @Post('setUser')
  async setUser(
    @Body(new ParseArrayPipe({ items: MemberDto, ...defaultValidationOptions }))
    members: MemberDto[]
  ): Promise<SessionType[]> {
    return this.authService.saveArrayCache(members);
  }
}
