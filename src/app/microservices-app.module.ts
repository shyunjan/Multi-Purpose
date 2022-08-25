import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import configuration, { APP_PHASE } from 'src/config/configuration';
import NoticeModule from './notice/notice.module';
import HelperModule from './helper/helper.module';

@Module({
  imports: [
    /* HttpAppModule에 설치된 ConfigModule을 여기서 별도로 생성해야 하는지 나중에 체크하자! */
    // ConfigModule.forRoot({
    //   // envFilePath: ['src/config/local/env.db'],
    //   load: [configuration],
    //   isGlobal: true, // 다른 모듈에서 ConfigModule을 별도로 import할 필요없이 바로 사용할 수 있다
    //   cache: true,
    // }),
    NoticeModule,
    HelperModule,
  ],
})
export default class MicroservicesAppModule {}
