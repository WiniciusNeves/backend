import { IsNotEmpty, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateProviderServiceDto {
  @IsNotEmpty()
  providerId: number;

  @IsNotEmpty()
  serviceId: number;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsString()
  status?: string;
}
