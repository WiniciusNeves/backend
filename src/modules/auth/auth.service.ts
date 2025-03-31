import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Verifique se o password foi fornecido
    if (!registerDto.password) {
      throw new Error('Password is required');
    }

    // Criptografe a senha
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Certifique-se de que o valor do role é válido
    const role = registerDto.role === 'common' || registerDto.role === 'admin' 
      ? registerDto.role 
      : Role.COMMON;

    // Crie o usuário
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      role, // Use o role validado ou o padrão
    });

    // Retorne o token JWT e os dados do usuário
    return {
      access_token: this.jwtService.sign({ id: user.id, email: user.email }),
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
