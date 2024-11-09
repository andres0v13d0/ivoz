import { IsString, IsDate, IsOptional } from 'class-validator';

export class CreateOAuthTokenDto {
  @IsString()
  userId: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsOptional()
  @IsDate()
  expiresAt?: Date;
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
}
