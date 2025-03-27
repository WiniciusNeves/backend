/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator'; // Importando decorators de validação

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'Nome é obrigatório' }) // Decorator de validação
  @IsString({ message: 'Nome deve ser uma string' }) // Decorator de validação
  nome: string;

  @Column()
  @IsEmail({}, { message: 'Email inválido' }) // Decorator de validação
  @IsNotEmpty({ message: 'Email é obrigatório' }) // Decorator de validação
  email: string;

  @Column()
  @Matches(/^\(\d{2}\) \d{5}-\d{4}$/, { message: 'Telefone inválido' }) // Decorator de validação com expressão regular
  @IsNotEmpty({ message: 'Telefone é obrigatório' }) // Decorator de validação
  telefone: string;

  @Column()
  @IsNotEmpty({ message: 'Senha é obrigatória' }) // Decorator de validação
  senha: string;

  @Column()
  foto: string;

  @Column({ default: 'comum' })
  role: string;
}
