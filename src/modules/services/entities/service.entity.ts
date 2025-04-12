import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Recommendation } from '../../recommendation/entities/recommendation.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Recommendation, (recommendation) => recommendation.service, { eager: true })
  recommendations: Recommendation[];

  @ManyToOne(() => Category, (category) => category.services, { nullable: false, eager: true })
  category: Category;

  @ManyToOne(() => User, (user) => user.services, { nullable: true, eager: true, onDelete: 'SET NULL' })
  user: User;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
