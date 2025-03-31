import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from 'src/modules/users/entities/user.entity';

export class RegisterDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    whatsapp: string;

    @MinLength(6)
    password: string;

    @IsNotEmpty()
    profile_picture: string;

    @IsNotEmpty()
    role: Role;

}
