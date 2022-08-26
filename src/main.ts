import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import fastify from "fastify";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { defaultValidationOptions } from "./init";
import HttpAppModule from "./app/http-app.module";
import MicroservicesAppModule from "./app/microservices-app.module";

async function bootstrapHttpApp() {
  const fastifyAdapter = new FastifyAdapter();
  /* Fastify를 사용하는 경우 middleware를 구성하기 위해서는 아래 과정이 필요하다.*/
  await fastifyAdapter.register(require("@fastify/middie"));

  const httpApp: NestFastifyApplication =
    await NestFactory.create<NestFastifyApplication>(
      HttpAppModule,
      fastifyAdapter
    );

  httpApp.useGlobalPipes(new ValidationPipe(defaultValidationOptions));

  // await app.listen(3000, '0.0.0.0');
  await httpApp.listen(3000);
}

async function bootstrapMessageApp() {
  const MessageApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    MicroservicesAppModule,
    {
      transport: Transport.REDIS,
      options: { host: "localhost", port: 12379 },
    }
  );

  MessageApp.useGlobalPipes(new ValidationPipe(defaultValidationOptions));

  MessageApp.listen();
}

bootstrapHttpApp();
bootstrapMessageApp();
