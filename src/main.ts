import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { FastifyInstance } from 'fastify';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { defaultValidationOptions } from './init';
import HttpAppModule from './app/http-app.module';
import MicroservicesAppModule from './app/microservices-app.module';

async function bootstrapHttpApp() {
  const fastifyAdapter = new FastifyAdapter();
  // const fastifyAdapter = new FastifyAdapter({ logger: true });
  const fastifyServer: FastifyInstance = fastifyAdapter.getInstance();
  fastifyServer.addHook('preValidation', (request, reply, done) => {
    console.log('Hooking preValidation...');
    done(); // express middleware의 next();와 동일
  });

  /* Fastify를 사용하는 경우 middleware를 구성하기 위해서는 아래 두 가지 방식 중 하나를 선택한다.
     https://www.fastify.io/docs/latest/Reference/Middleware/ */
  // await fastify.register(require('@fastify/express' 혹은 "@fastify/middie"))

  const httpApp: NestFastifyApplication =
    await NestFactory.create<NestFastifyApplication>(
      HttpAppModule,
      fastifyAdapter
      // { cors: true }
    );
  /* http-app.module.ts -> GraphQLModule 초기화에서 cors: true 로 설정했기 때문에 여기서는 생략한다. 
     만약 여기서도 설정하면 FST_ERR_DEC_ALREADY_PRESENT(name) 오류가 발생한다. */
  // httpApp.enableCors();

  httpApp.useGlobalPipes(new ValidationPipe(defaultValidationOptions));

  // await app.listen(3000, '0.0.0.0');
  await httpApp.listen(3000);
}

async function bootstrapMessageApp() {
  const MessageApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    MicroservicesAppModule,
    {
      transport: Transport.REDIS,
      options: { host: 'localhost', port: 12379 },
    }
  );

  MessageApp.useGlobalPipes(new ValidationPipe(defaultValidationOptions));

  MessageApp.listen();
}

bootstrapHttpApp();
bootstrapMessageApp();
