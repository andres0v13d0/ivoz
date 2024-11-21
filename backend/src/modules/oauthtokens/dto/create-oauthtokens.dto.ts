import { IsString, IsDate, IsOptional, IsBoolean } from 'class-validator';

export class CreateOAuthTokenDto {
  @IsString()
  userId: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsDate()
  expiresAt: Date;

  @IsOptional()
  @IsBoolean()
  needsRenewal?: boolean;
}

export class UpdateOAuthTokenDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  accessToken?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsDate()
  expiresAt?: Date;

  @IsOptional()
  @IsBoolean()
  needsRenewal?: boolean;
}
