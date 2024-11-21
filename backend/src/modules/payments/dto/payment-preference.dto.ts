import { IsString, IsNumber, IsEnum, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentPreferenceDto {
  @IsString()
  orderId: string;

  @IsString()
  preferenceId: string;

  @IsNumber()
  amount: number;
}

export class UpdatePaymentStatusDto {
  @IsEnum(['pending', 'approved', 'rejected'])
  status: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  paymentDate?: Date;
}
