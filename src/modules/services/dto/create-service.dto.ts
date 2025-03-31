import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
