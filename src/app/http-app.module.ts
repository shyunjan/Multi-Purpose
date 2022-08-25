import { Module } from '@nestjs/common';
import CommonModule from './common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { APP_PHASE } from 'src/config/configuration';
import { InitiateSystemController } from '../init';
import AuthModule from './auth/auth.module';
import ProductsModule from './products/products.module';
import OrdersModule from './orders/orders.module';
import NoticeModule from './notice/notice.module';

// class MongooseConfigService implements MongooseOptionsFactory {
//   createMongooseOptions(): MongooseModuleOptions {
//     return {
//       uri: 'mongodb://localhost:27017/multi-purpose',
//       // dbName: 'multi-purpose',
//       // authSource: 'multi-purpose',
//       user: 'appAdmin',
//       pass: 'ajf5gus&@wo',
//       // bufferCommands: false,
//       // useNewUrlParser: true, // 구 Node.js driver for MongoDB의 deprecation warnings이 나타나지 않도록 한다.
//       // useUnifiedTopology: true,
//       connectionFactory: (connection: Connection) => {
//         connection.plugin(require('mongoose-autopopulate'));
//         // const SequenceFactory = require('mongoose-sequence');
//         // const SequenceIncrement = require('mongoose-sequence')(connection);
//         // connection.plugin(SequenceIncrement, { inc_field: 'id' });
//         return connection;
//       },
//     };
//   }
// }

// @Module({
//   providers: [MongooseConfigService],
//   exports: [MongooseConfigService],
// })
// class MongooseConfigModule {}

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: ['src/config/local/env.db'],
      load: [configuration],
      isGlobal: true, // 다른 모듈에서 ConfigModule을 별도로 import할 필요없이 바로 사용할 수 있다
      cache: true,
    }),
    MongooseModule.forRootAsync({
      // connectionName: 'multi-purpose.master', // 커넥션을 여러 개 만들면 이름으로 구분이 필요하다.
      imports: [
        // MongooseConfigModule,
        ConfigModule.forFeature(require(`src/config/${APP_PHASE}/config.db`).default),
      ],
      // useFactory: async (configService: MongooseConfigService): Promise<MongooseModuleOptions> => {
      //   return configService.createMongooseOptions();
      // },
      useFactory: async (config: ConfigService) => {
        const domain = config.get<string>('MONGO_DB_DOMAIN'),
          port = config.get<number>('MONGO_DB_PORT') ?? 27017,
          database = config.get<string>('MONGO_DATABASE');
        return {
          uri: `${domain}:${port}/${database}`,
          // dbName: 'multi-purpose',
          // authSource: 'multi-purpose',
          user: config.get<string>('MONGO_DB_USER_NAME'),
          pass: config.get<string>('MONGO_DB_PASSWORD'),
          // bufferCommands: false,
          // useNewUrlParser: true, // 구 Node.js driver for MongoDB의 deprecation warnings이 나타나지 않도록 한다.
          // useUnifiedTopology: true,
          connectionFactory: (connection: Connection) => {
            connection.plugin(require('mongoose-autopopulate'));
            // const SequenceFactory = require('mongoose-sequence');
            // const SequenceIncrement = require('mongoose-sequence')(connection);
            // connection.plugin(SequenceIncrement, { inc_field: 'id' });
            return connection;
          },
        };
      },
      // useExisting: MongooseConfigService,
      // inject: [MongooseConfigService],
      inject: [ConfigService],
      // useClass: MongooseConfigService,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async () => ({
        debug: false,
        playground: false,
        path: 'api', // 'http://domain:port/api
        // typePaths: ['./**/*.graphql'],
        // autoSchemaFile: true,
        autoSchemaFile: 'src/schema.gql',
      }),
    }),
    CommonModule,
    AuthModule,
    // MongooseModule.forRoot('mongodb://localhost:27017/multi-purpose', {
    //   user: 'appAdmin',
    //   pass: 'ajf5gus&@wo',
    //   connectionFactory: (connection: Connection): Connection => {
    //     connection.plugin(require('mongoose-autopopulate'));
    //     const AutoIncrement = require('mongoose-sequence')(connection);
    //     connection.plugin(AutoIncrement);
    //     return connection;
    //   },
    // }),
    ProductsModule,
    OrdersModule,
    NoticeModule,
  ],
  controllers: [InitiateSystemController],
})
export default class HttpAppModule {}
