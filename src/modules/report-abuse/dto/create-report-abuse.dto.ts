import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateReportAbuseDto {
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
