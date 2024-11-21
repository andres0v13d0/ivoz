import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentPreferenceDocument = HydratedDocument<PaymentPreference>;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class PaymentPreference {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ required: true })
  preferenceId: string;

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: string;

  @Prop({ required: true })
  amount: number;

  @Prop()
  paymentDate: Date;
}

export const PaymentPreferenceSchema = SchemaFactory.createForClass(PaymentPreference);
