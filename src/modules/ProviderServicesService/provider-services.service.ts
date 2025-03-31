import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProviderService } from './entities/provider-service.entity';
import { CreateProviderServiceDto } from './dto/create-provider-service.dto';
import { UpdateProviderServiceDto } from './dto/update-provider-service.dto';
import { ProvidersService } from '../providers/providers.service';
import { ServicesService } from '../services/services.service';

@Injectable()
export class ProviderServicesService {
  constructor(
    private readonly providersService: ProvidersService,
    private readonly servicesService: ServicesService,
    @InjectRepository(ProviderService)
    private readonly providerServiceRepository: Repository<ProviderService>,
  ) {}

  async create(dto: CreateProviderServiceDto) {
    const provider = await this.providersService.findOne(dto.providerId);
    const service = await this.servicesService.findOne(dto.serviceId);

    if (!provider || !service) {
      throw new NotFoundException('Provider or Service not found');
    }

    const providerService = this.providerServiceRepository.create({ ...dto, provider, service });
    return this.providerServiceRepository.save(providerService);
  }

  async findAll() {
    return this.providerServiceRepository.find({ relations: ['provider', 'service'] });
  }

  async findOne(id: number) {
    const providerService = await this.providerServiceRepository.findOne({ where: { id }, relations: ['provider', 'service'] });
    if (!providerService) {
      throw new NotFoundException('Provider Service not found');
    }
    return providerService;
  }

  async update(id: number, dto: UpdateProviderServiceDto) {
    const providerService = await this.findOne(id);
    Object.assign(providerService, dto);
    return this.providerServiceRepository.save(providerService);
  }

  async remove(id: number) {
    const providerService = await this.findOne(id);
    return this.providerServiceRepository.remove(providerService);
  }
}
