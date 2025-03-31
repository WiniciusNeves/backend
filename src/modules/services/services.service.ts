import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private categoriesService: CategoriesService,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const category = await this.categoriesService.findOne(createServiceDto.categoryId);
    const service = this.serviceRepository.create({ ...createServiceDto, category });
    return this.serviceRepository.save(service);
  }

  findAll() {
    return this.serviceRepository.find();
  }

  async findOne(id: number) {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    await this.findOne(id);
    await this.serviceRepository.update(id, updateServiceDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const service = await this.findOne(id);
    return this.serviceRepository.remove(service);
  }
}
