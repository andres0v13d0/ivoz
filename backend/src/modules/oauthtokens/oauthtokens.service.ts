import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OAuthToken, OAuthTokenDocument } from './schemas/oauthtoken.schema';
import { CreateOAuthTokenDto, UpdateOAuthTokenDto } from './dto/create-oauthtokens.dto';

@Injectable()
export class OAuthTokensService {
  constructor(@InjectModel(OAuthToken.name) private oauthTokenModel: Model<OAuthTokenDocument>) {}

  async create(createOAuthTokenDto: CreateOAuthTokenDto): Promise<OAuthToken> {
    const token = new this.oauthTokenModel({
      ...createOAuthTokenDto,
      userId: new Types.ObjectId(createOAuthTokenDto.userId),
    });
    return token.save();
  }

  async findByUserId(userId: string): Promise<OAuthToken | undefined> {
    return this.oauthTokenModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
  }

  async updateToken(userId: string, updateOAuthTokenDto: UpdateOAuthTokenDto): Promise<OAuthToken> {
    const token = await this.oauthTokenModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      updateOAuthTokenDto,
      { new: true }
    ).exec();

    if (!token) throw new NotFoundException('Token not found');
    return token;
  }

  async needsRenewal(userId: string): Promise<boolean> {
    const token = await this.findByUserId(userId);
    if (!token) throw new NotFoundException('Token not found');
    return token.needsRenewal;
  }

  async renewToken(userId: string, newAccessToken: string, newRefreshToken: string, expiresAt: Date): Promise<OAuthToken> {
    const updatedToken = await this.oauthTokenModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { accessToken: newAccessToken, refreshToken: newRefreshToken, expiresAt, needsRenewal: false },
      { new: true }
    ).exec();

    if (!updatedToken) throw new NotFoundException('Token not found for renewal');
    return updatedToken;
  }
}
