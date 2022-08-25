import { Module, CacheModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as RedisStore from 'cache-manager-ioredis';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';

export const clientOfRedis = Symbol('clients');

@Module({
  imports: [
    // ClientsModule.registerAsync([{...}]),
    ClientsModule.register([
      { name: clientOfRedis, transport: Transport.REDIS, options: { host: 'localhost', port: 12379 } },
    ]),
    CacheModule.register({
      store: RedisStore,
      host: 'localhost',
      port: 12379,
      isGlobal: true,
      ttl: 0, // seconds, { ttl: 0 } disable expiration of the cache
      max: 100, // maximum number of items in cache
    }),
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [ClientsModule],
})
export default class CommonModule {}
