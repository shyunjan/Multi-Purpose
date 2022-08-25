import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { clientOfRedis } from '../common/common.module';
import { NoticeService } from './notice.service';
import { timeout } from 'rxjs';

@Controller('notice')
export class NoticeController {
  constructor(
    private readonly noticeService: NoticeService,
    @Inject(clientOfRedis) private readonly client: ClientProxy
  ) {}

  @Get('publish')
  // async publish(@Query('msg') msg: string) {   // 이 경우는 string 타입으로 들어온다
  /* 그러나 아래 경우는 object 타입으로 들어온다. 데코레이터 안의 파라미터 여부에 따라 타입이 결정된다. */
  async publish(@Query() msg: Record<string, string>) {
    console.log(typeof msg);
    console.info('Sending an event. The event type =', 'notice');
    return this.client.emit('notice', { data: msg }).pipe(timeout(3000));
  }
}
