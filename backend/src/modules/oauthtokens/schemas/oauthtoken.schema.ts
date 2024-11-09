import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OAuthTokenDocument = HydratedDocument<OAuthToken>;

@Schema({ timestamps: { createdAt: 'createdAt' }})
export class OAuthToken {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  accessToken: string;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const OAuthTokenSchema = SchemaFactory.createForClass(OAuthToken);
