import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recommendation } from './entities/recommendation.entity';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';
import { UsersService } from '../users/users.service';
import { ServicesService } from '../services/services.service';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Recommendation)
    private readonly recommendationRepository: Repository<Recommendation>,
    private readonly usersService: UsersService,
    private readonly servicesService: ServicesService,
  ) {}

  async create(dto: CreateRecommendationDto) {
    const user = await this.usersService.findOne(dto.userId);
    const service = await this.servicesService.findOne(dto.serviceId);

    if (!user || !service) {
      throw new NotFoundException('User or Service not found');
    }

    const recommendation = this.recommendationRepository.create({ ...dto, user, service });
    return this.recommendationRepository.save(recommendation);
  }

  async findAll() {
    return this.recommendationRepository.find({ relations: ['user', 'service'] });
  }

  async findOne(id: number) {
    const recommendation = await this.recommendationRepository.findOne({ where: { id }, relations: ['user', 'service'] });
    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }
    return recommendation;
  }

  async update(id: number, dto: UpdateRecommendationDto) {
    const recommendation = await this.findOne(id);
    Object.assign(recommendation, dto);
    return this.recommendationRepository.save(recommendation);
  }

  async remove(id: number) {
    const recommendation = await this.findOne(id);
    return this.recommendationRepository.remove(recommendation);
  }
}
