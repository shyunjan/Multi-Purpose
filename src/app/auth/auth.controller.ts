import {
  Controller,
  HttpStatus,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Res,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { MemberDto, LoginMemberDto, UpdateMemberDto } from './dto';
import { SessionType } from 'src/types';

@Controller('auth')
/* Singleton이 아닌 Multi-Thread 방식(request scope)으로 사용할려면 아래와 같이 scope를 셋팅한다 */
// @Controller({
//   path: 'auth',
//   scope: Scope.REQUEST,
// })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  async loginTester(@Query('loginId') loginId: string): Promise<SessionType | string> {
    const loginData = new LoginMemberDto(loginId, '^123456@password!');
    const result = await this.authService.loginCache(loginData);
    return result ?? 'Exception';
  }

  @Post('login')
  async login(@Body() loginData: LoginMemberDto): Promise<SessionType | string> {
    const result = await this.authService.loginCache(loginData);
    return result ?? 'Exception';
  }

  @Post('create')
  create(@Res({ passthrough: true }) res: FastifyReply, @Body() memberDto: MemberDto): string {
    res.code(HttpStatus.CREATED);
    // res.header(key: string, value: any);
    return this.authService.create(memberDto);
  }

  @Get('get')
  // getUser(@Query() params: getUserParams): string {
  getUser(
    @Query('id', new DefaultValuePipe(1), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND }))
    id: number
  ): string {
    return this.authService.getUser(+id);
  }

  @Get('get-users')
  getUsers(@Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[]): string[] {
    return ids.map((n) => n.toString());
  }

  @Patch('update/:id')
  update(
    // @Param('id') id: number,
    /* 최초 Validation 설정시(main.ts 참조)에 new ValidationPipe({ transform: true })로 옵션을 설정하고 
       위 라인의 코드를 사용하면 별도로 아래처럼 Pipe를 설치하지 않아도 number로 자동으로 변환된다. 
       단, validation exception 처리는 해주지 않는다.
     */
    @Param('id', ParseIntPipe) id: number,
    @Body() memberDto: UpdateMemberDto
  ) {
    // console.log("typeof id === 'number' =", typeof id === 'number');
    return this.authService.update(id, memberDto);
  }
}
