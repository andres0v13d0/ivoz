import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean, IsDate } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  clientId: string;

  @IsString()
  talentId: string;

  @IsEnum(['pending', 'in_progress', 'completed', 'cancelled'])
  status: string;

  @IsEnum(['pending', 'paid', 'held', 'released', 'refunded'])
  paymentStatus: string;

  @IsBoolean()
  approvedByClient: boolean;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsDate()
  deliveryDate?: Date;

  @IsOptional()
  @IsDate()
  completedAt?: Date;

  @IsOptional()
  @IsDate()
  cancelledAt?: Date;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  talentId?: string;

  @IsOptional()
  @IsEnum(['pending', 'in_progress', 'completed', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsEnum(['pending', 'paid', 'held', 'released', 'refunded'])
  paymentStatus?: string;

  @IsOptional()
  @IsBoolean()
  approvedByClient?: boolean;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDate()
  deliveryDate?: Date;

  @IsOptional()
  @IsDate()
  completedAt?: Date;

  @IsOptional()
  @IsDate()
  cancelledAt?: Date;
}
