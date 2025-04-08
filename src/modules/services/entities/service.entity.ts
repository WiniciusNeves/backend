import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Recommendation } from '../../recommendation/entities/recommendation.entity';

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
}
