// src/modules/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../users/entities/user.entity';
import * as admin from 'firebase-admin';
import { VerifyEmailDto } from './dto/verifyEmailDto';
import { EmailService } from '../../common/services/email.service';

@Injectable()
export class AuthService {
  private tokenBlacklist: Set<string> = new Set(); // Lista negra de tokens

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) { }

  async register(registerDto: RegisterDto) {
    if (!registerDto.password) {
      throw new Error('Password is required');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const role = registerDto.role === 'common' || registerDto.role === 'admin'
      ? registerDto.role
      : Role.COMMON;

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      role,
    });

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

  async logout(token: string) {
    this.tokenBlacklist.add(token); // Adiciona o token à lista negra
    return { message: 'Logout realizado com sucesso' };
  }

  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token); // Verifica se o token está na lista negra
  }

  async refreshToken(oldToken: string) {
    if (this.isTokenBlacklisted(oldToken)) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    const decoded = this.jwtService.decode(oldToken) as any;
    const payload = { sub: decoded.sub, email: decoded.email };

    const newToken = this.jwtService.sign(payload, { expiresIn: '15m' }); // Novo token com expiração
    return { access_token: newToken };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Simula o envio de um e-mail com um token de recuperação
    const resetToken = this.jwtService.sign({ id: user.id }, { expiresIn: '1h' });
    // Aqui você pode integrar com um serviço de e-mail para enviar o token
    console.log(`Token de recuperação enviado para ${email}: ${resetToken}`);

    return { message: 'E-mail de recuperação de senha enviado com sucesso' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findById(decoded.id);

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.usersService.updatePassword(user.id, hashedPassword);

      return { message: 'Senha resetada com sucesso' };
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findById(decoded.id);

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      await this.usersService.verifyEmail(user.id.toString());
      return { message: 'E-mail verificado com sucesso' };
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  async loginWithGoogle(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { email, name, picture } = decodedToken;

      if (!email) {
        throw new Error('E-mail não encontrado no token de autenticação');
      }

      let user = await this.usersService.findByEmail(email);

      if (!user) {
        user = await this.usersService.create({
          email,
          name,
          profile_picture: picture,
          auth_provider: 'google',
          phone: '',
          whatsapp: '',
          password: '',
          role: Role.COMMON,
        });
      }

      const payload = { sub: user.id, email: user.email };
      const jwtToken = this.jwtService.sign(payload);

      return {
        message: 'Login com Google realizado com sucesso!',
        user,
        access_token: jwtToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
  async sendVerificationCode(email: string) {
    const user = await this.usersService.findByEmail(email);
    if(!user){
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const code = Math.floor(1000 + Math.random()*9000).toString();
    user.verificationCode = code;

    await this.emailService.sendVerificationCode(user.email, code);
    await this.usersService.update(user.id, user);

    return { message: 'Código de verificação enviado com sucesso' };

  }
  async verifyEmailCode(verifyEmailDto: VerifyEmailDto) {
    const user = await this.usersService.findByEmail(verifyEmailDto.email);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (user.verificationCode !== verifyEmailDto.code) {
      throw new UnauthorizedException('Código de verificação inválido');
    }

    user.isEmailVerified = true;
    await this.usersService.update(user.id, user);

    return { message: 'E-mail verificado com sucesso' };
  }
}

