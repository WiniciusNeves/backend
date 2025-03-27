import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'O email informado não é válido.' }) // Valida se é um email válido
  @IsNotEmpty({ message: 'O campo email é obrigatório.' }) // Garante que o campo não está vazio
  email: string;

  @IsNotEmpty({ message: 'O campo senha é obrigatório.' }) // Garante que o campo não está vazio
  senha: string;
}