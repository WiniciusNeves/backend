// src/modules/users/dto/update-user.dto.ts

import { IsOptional, IsString, IsEmail, IsPhoneNumber, IsEnum } from 'class-validator';
import { Role } from '../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsPhoneNumber()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  profile_picture?: string | null;
}
