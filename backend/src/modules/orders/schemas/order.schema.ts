import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  clientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  talentId: Types.ObjectId;

  @Prop({ enum: ['pending', 'in_progress', 'completed', 'cancelled'], required: true, default: 'pending' })
  status: string;

  @Prop({ enum: ['pending', 'paid', 'held', 'released', 'refunded'], required: true, default: 'pending' })
  paymentStatus: string;

  @Prop({ required: true, default: false })
  approvedByClient: boolean;

  @Prop({ required: true })
  amount: number;

  @Prop()
  deliveryDate: Date;

  @Prop()
  completedAt: Date;

  @Prop()
  cancelledAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
