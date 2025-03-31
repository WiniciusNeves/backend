import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateProviderDto {
  @IsOptional()
  @IsString()
  cpf_cnpj?: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
