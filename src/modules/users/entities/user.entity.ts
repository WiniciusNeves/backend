import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Defina o enum Role
export enum Role {
  COMMON = 'common',
  PROVIDER = 'provider',
  ADMIN = 'admin',
}

@Entity('users')  // Nome da tabela no banco de dados
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profile_picture: string;

  @Column({ type: 'enum', enum: Role }) // Use o enum Role aqui
  role: Role;

  @Column({ type: 'varchar', length: 20, unique: true })
  whatsapp: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}