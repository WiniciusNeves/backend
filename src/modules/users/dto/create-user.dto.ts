// src/modules/users/dto/create-user.dto.ts

import { IsString, IsEmail, IsPhoneNumber, IsEnum } from 'class-validator';
import { Role } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsPhoneNumber()
  whatsapp: string;

  @IsString()
  profile_picture?: string;

  @IsString()
  auth_provider?: string; // 'google', 'local', etc.
   
   
}
