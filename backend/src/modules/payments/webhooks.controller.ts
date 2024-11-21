import { Controller, Post, Headers, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('mercadopago')
  @HttpCode(HttpStatus.OK)
  async handleMercadoPagoWebhook(
    @Headers('x-idempotency-key') idempotencyKey: string,
    @Body() body: any,
  ): Promise<void> {
    const { id: preferenceId, status, date_approved } = body;

    if (!preferenceId || !status) {
      console.warn('Invalid webhook payload:', body);
      return;
    }

    await this.paymentsService.updatePaymentStatus(preferenceId, {
      status,
      paymentDate: date_approved ? new Date(date_approved) : undefined,
    });
  }
}
