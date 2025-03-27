import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Método para validar o usuário
  async login(loginDTO: LoginDto): Promise<{ accessToken: string }> {
    const { email, senha } = loginDTO;

    // Verifica se o usuário existe
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verifica se a senha está correta
    const isPasswordValid: boolean = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Cria o payload do token JWT
    const payload = { email: user.email, sub: user.id };

    // Gera o token de acesso
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}