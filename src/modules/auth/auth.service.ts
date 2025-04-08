// src/modules/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../users/entities/user.entity';
import * as admin from 'firebase-admin';

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

  async logout() {
    // Implemente a lógica de logout aqui
    // Por exemplo, você pode invalidar o token JWT
    return { message: 'Logout realizado com sucesso' };
  }

  async refreshToken() {
    // Implemente a lógica de refresh token aqui
    // Por exemplo, você pode gerar um novo token JWT
    return { message: 'Token de refresh gerado com sucesso' };
  }

  async forgotPassword(email: string) {
    // Implemente a lógica de forgot password aqui
    // Por exemplo, você pode enviar um e-mail com um link de recuperação de senha
    return { message: 'E-mail de recuperação de senha enviado com sucesso' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Implemente a lógica de reset password aqui
    // Por exemplo, você pode atualizar a senha do usuário
    return { message: 'Senha resetada com sucesso' };
  }

  async verifyEmail(token: string) {
    // Implemente a lógica de verify email aqui
    // Por exemplo, você pode verificar se o token é válido
    return { message: 'E-mail verificado com sucesso' };
  }

  async loginWithGoogle(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { email, name, picture, uid } = decodedToken;
      
      if(!email) {
        throw new Error('E-mail não encontrado no token de autenticação');
      }

      let user = await this.usersService.findByEmail(email);

      if (!user) {
        user = await this.usersService.create({
          email,
          name,
          profile_picture: picture,
          auth_provider: 'google',
          phone: '', // ou outro valor padrão
          whatsapp: '', // ou outro valor padrão
          password: '', // ou outro valor padrão
          role: Role.COMMON, // ou outro valor padrão
        });
      }

      return {
        message: 'Login com Google realizado com sucesso!',
        user,
        token: idToken, // ou gere um token próprio, se quiser
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}