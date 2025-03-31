import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from './entities/provider.entity';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateProviderDto) {
    const user = await this.usersService.findOne(dto.user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const provider = this.providerRepository.create({ ...dto, user });
    return this.providerRepository.save(provider);
  }

  async findAll() {
    return this.providerRepository.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    const provider = await this.providerRepository.findOne({ where: { id }, relations: ['user'] });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
    return provider;
  }

  async update(id: number, dto: UpdateProviderDto) {
    const provider = await this.findOne(id);
    Object.assign(provider, dto);
    return this.providerRepository.save(provider);
  }

  async remove(id: number) {
    const provider = await this.findOne(id);
    return this.providerRepository.remove(provider);
  }
}
