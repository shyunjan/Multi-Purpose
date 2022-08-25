import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { defaultValidationOptions } from './init';
import HttpAppModule from './app/http-app.module';
import MicroservicesAppModule from './app/microservices-app.module';

async function bootstrapHttpApp() {
  const httpApp: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    HttpAppModule,
    new FastifyAdapter()
  );

  httpApp.useGlobalPipes(new ValidationPipe(defaultValidationOptions));

  // await app.listen(3000, '0.0.0.0');
  await httpApp.listen(3000);
}

async function bootstrapMessageApp() {
  const MessageApp = await NestFactory.createMicroservice<MicroserviceOptions>(MicroservicesAppModule, {
    transport: Transport.REDIS,
    options: { host: 'localhost', port: 12379 },
  });

  MessageApp.useGlobalPipes(new ValidationPipe(defaultValidationOptions));

  MessageApp.listen();
}

bootstrapHttpApp();
bootstrapMessageApp();
