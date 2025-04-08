// src/modules/recommendation/entities/recommendation.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Service } from 'src/modules/services/entities/service.entity'; // ajuste se o caminho for diferente

@Entity()
export class Recommendation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.recommendations)
  user: User;

  @ManyToOne(() => User, (user) => user.recommendedBy)
  recommended: User;

  @ManyToOne(() => Service, (service) => service.recommendations)
  service: Service;

  @Column({ type: 'int', default: 5 })
  stars: number;
}
