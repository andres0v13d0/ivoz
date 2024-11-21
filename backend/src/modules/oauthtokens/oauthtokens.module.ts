import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OAuthTokensController } from './oauthtokens.controller';
import { OAuthTokensService } from './oauthtokens.service';
import { OAuthToken, OAuthTokenSchema } from './schemas/oauthtoken.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: OAuthToken.name, schema: OAuthTokenSchema }])],
  controllers: [OAuthTokensController],
  providers: [OAuthTokensService],
  exports: [OAuthTokensService],
})
export class OAuthTokensModule {}
