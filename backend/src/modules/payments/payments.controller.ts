import { Controller, Post, Get, Patch, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentPreferenceDto, UpdatePaymentStatusDto } from './dto/payment-preference.dto';
import { PaymentPreference } from './schemas/payment-preference.schema';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':orderId')
  @HttpCode(HttpStatus.OK)
  async getPaymentPreference(@Param('orderId') orderId: string): Promise<PaymentPreference> {
    return this.paymentsService.getPaymentPreference(orderId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPaymentPreference(
    @Body() createPaymentPreferenceDto: CreatePaymentPreferenceDto,
  ): Promise<PaymentPreference> {
    return this.paymentsService.createPaymentPreference(createPaymentPreferenceDto);
  }

  @Patch(':preferenceId/status')
  @HttpCode(HttpStatus.OK)
  async updatePaymentStatus(
    @Param('preferenceId') preferenceId: string,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
  ): Promise<PaymentPreference> {
    return this.paymentsService.updatePaymentStatus(preferenceId, updatePaymentStatusDto);
  }
}
