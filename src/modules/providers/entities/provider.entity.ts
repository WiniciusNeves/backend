import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  cpf_cnpj: string;

  @Column()
  date_of_birth: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
