import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaymentPreference, PaymentPreferenceDocument } from './schemas/payment-preference.schema';
import { CreatePaymentPreferenceDto, UpdatePaymentStatusDto } from './dto/payment-preference.dto';
import { MercadoPagoConfig, Payment } from 'mercadopago';

@Injectable()
export class PaymentsService {
  private client: MercadoPagoConfig;
  private payment: Payment;

  constructor(
    @InjectModel(PaymentPreference.name) private paymentPreferenceModel: Model<PaymentPreferenceDocument>
  ) {
    this.client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN, options: { timeout: 5000 } });
    this.payment = new Payment(this.client);
  }

  async createPaymentPreference(createPaymentDto: CreatePaymentPreferenceDto): Promise<PaymentPreference> {
    const { orderId, amount } = createPaymentDto;

    const body = {
      transaction_amount: amount,
      description: `Order ${orderId}`,
      payment_method_id: 'visa',
      payer: { email: 'payer_email@example.com' },
    };

    const requestOptions = {
      idempotencyKey: `order-${orderId}`,
    };

    try {
      const response = await this.payment.create({ body, requestOptions });
      if (!response || !response.id) {
        throw new BadRequestException('Error creating payment preference in MercadoPago');
      }

      const paymentPreference = new this.paymentPreferenceModel({
        orderId: new Types.ObjectId(orderId),
        preferenceId: response.id,
        status: 'pending',
        amount,
      });

      return paymentPreference.save();
    } catch (error) {
      throw new BadRequestException('Failed to create payment preference in MercadoPago');
    }
  }

  async getPaymentPreference(orderId: string): Promise<PaymentPreference> {
    const paymentPreference = await this.paymentPreferenceModel.findOne({ orderId: new Types.ObjectId(orderId) });
    if (!paymentPreference) {
      throw new NotFoundException('Payment preference not found');
    }
    return paymentPreference;
  }

  async updatePaymentStatus(preferenceId: string, updatePaymentDto: UpdatePaymentStatusDto): Promise<PaymentPreference> {
    const { status, paymentDate } = updatePaymentDto;

    const paymentPreference = await this.paymentPreferenceModel.findOneAndUpdate(
      { preferenceId },
      { status, paymentDate },
      { new: true }
    );

    if (!paymentPreference) {
      throw new NotFoundException('Payment preference not found');
    }

    return paymentPreference;
  }
}
