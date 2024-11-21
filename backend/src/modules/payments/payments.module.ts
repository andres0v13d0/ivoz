import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { WebhooksController } from './webhooks.controller';

@Module({
  providers: [PaymentsService],
  controllers: [PaymentsController, WebhooksController]
})
export class PaymentsModule {}
