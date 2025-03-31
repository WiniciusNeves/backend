import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ProvidersService } from '../providers/providers.service';
import { ServicesService } from '../services/services.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    private readonly providersService: ProvidersService,
    private readonly servicesService: ServicesService,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateFeedbackDto) {
    const provider = await this.providersService.findOne(dto.providerId);
    const service = await this.servicesService.findOne(dto.serviceId);
    const user = await this.usersService.findOne(dto.userId);

    if (!provider || !service || !user) {
      throw new NotFoundException('Provider, Service, or User not found');
    }

    const feedback = this.feedbackRepository.create({ ...dto, provider, service, user });
    return this.feedbackRepository.save(feedback);
  }

  async findAll() {
    return this.feedbackRepository.find({ relations: ['provider', 'service', 'user'] });
  }

  async findOne(id: number) {
    const feedback = await this.feedbackRepository.findOne({ where: { id }, relations: ['provider', 'service', 'user'] });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    return feedback;
  }

  async update(id: number, dto: UpdateFeedbackDto) {
    const feedback = await this.findOne(id);
    Object.assign(feedback, dto);
    return this.feedbackRepository.save(feedback);
  }

  async remove(id: number) {
    const feedback = await this.findOne(id);
    return this.feedbackRepository.remove(feedback);
  }
}
