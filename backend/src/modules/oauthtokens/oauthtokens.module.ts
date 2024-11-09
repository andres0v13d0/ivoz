import { Module } from '@nestjs/common';
import { OauthtokensController } from './oauthtokens.controller';
import { OauthtokensService } from './oauthtokens.service';

@Module({
  controllers: [OauthtokensController],
  providers: [OauthtokensService]
})
export class OauthtokensModule {}
