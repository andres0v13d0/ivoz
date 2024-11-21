import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { UsersModule } from './modules/users/users.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OAuthTokensModule } from './modules/oauthtokens/oauthtokens.module';
import { PaymentsModule } from './modules/payments/payments.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongoUri'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    OrdersModule,
    OAuthTokensModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
