import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OAuthTokenDocument = HydratedDocument<OAuthToken>;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class OAuthToken {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  accessToken: string;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  needsRenewal: boolean;
}

export const OAuthTokenSchema = SchemaFactory.createForClass(OAuthToken);

OAuthTokenSchema.pre<OAuthTokenDocument>('save', function (next) {
  const currentDate = new Date();
  if (this.expiresAt <= currentDate) {
    this.needsRenewal = true;
  } else {
    this.needsRenewal = false;
  }
  next();
});
