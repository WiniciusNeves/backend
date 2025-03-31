import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateProviderDto {
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  cpf_cnpj: string;

  @IsNotEmpty()
  @IsDateString()
  date_of_birth: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsString()
  description?: string;
}
