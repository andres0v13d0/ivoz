import { Controller, Get, Post, Patch, Body, Param, NotFoundException } from '@nestjs/common';
import { OAuthTokensService } from './oauthtokens.service';
import { CreateOAuthTokenDto, UpdateOAuthTokenDto } from './dto/create-oauthtokens.dto';

@Controller('oauthtokens')
export class OAuthTokensController {
  constructor(private readonly oauthTokensService: OAuthTokensService) {}

  @Post()
  async createToken(@Body() createOAuthTokenDto: CreateOAuthTokenDto) {
    return this.oauthTokensService.create(createOAuthTokenDto);
  }

  @Get(':userId')
  async getTokenByUserId(@Param('userId') userId: string) {
    const token = await this.oauthTokensService.findByUserId(userId);
    if (!token) throw new NotFoundException('Token not found');
    return token;
  }

  @Patch(':userId')
  async updateToken(
    @Param('userId') userId: string,
    @Body() updateOAuthTokenDto: UpdateOAuthTokenDto
  ) {
    return this.oauthTokensService.updateToken(userId, updateOAuthTokenDto);
  }

  @Get(':userId/needs-renewal')
  async checkNeedsRenewal(@Param('userId') userId: string) {
    return { needsRenewal: await this.oauthTokensService.needsRenewal(userId) };
  }

  @Patch(':userId/renew')
  async renewToken(
    @Param('userId') userId: string,
    @Body() body: { accessToken: string; refreshToken: string; expiresAt: Date }
  ) {
    const { accessToken, refreshToken, expiresAt } = body;
    return this.oauthTokensService.renewToken(userId, accessToken, refreshToken, expiresAt);
  }
}
