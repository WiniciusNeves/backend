import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Recommendation } from '../../recommendation/entities/recommendation.entity';
import { IsEmail, IsEnum, IsPhoneNumber, IsString } from 'class-validator';
import { Service } from '@/modules/services/entities/service.entity';

export enum Role {
  COMMON = 'common',
  PROVIDER = 'provider',
  ADMIN = 'admin',
}

@Entity('users') // Nome da tabela no banco de dados
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profile_picture: string | null;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column({ type: 'varchar', length: 20, unique: true })
  whatsapp: string;

  @OneToMany(() => Recommendation, (recommendation) => recommendation.user)
  recommendations: Recommendation[];

  @OneToMany(() => Recommendation, (recommendation) => recommendation.recommended)
  recommendedBy: Recommendation[];

  @OneToMany(() => Service, (service) => service.user, { cascade: true })
  services: Service[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}

