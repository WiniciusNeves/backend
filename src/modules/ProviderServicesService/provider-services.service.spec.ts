import { Test, TestingModule } from '@nestjs/testing';
import { ProviderServicesService } from './provider-services.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProviderService } from './entities/provider-service.entity';
import { ProvidersService } from '../providers/providers.service';
import { ServicesService } from '../services/services.service';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

const mockProvidersService = () => ({
  findOne: jest.fn(),
});

const mockServicesService = () => ({
  findOne: jest.fn(),
});

describe('ProviderServicesService', () => {
  let service: ProviderServicesService;
  let repository: Repository<ProviderService>;
  let providersService: ProvidersService;
  let servicesService: ServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderServicesService,
        { provide: getRepositoryToken(ProviderService), useFactory: mockRepository },
        { provide: ProvidersService, useFactory: mockProvidersService },
        { provide: ServicesService, useFactory: mockServicesService },
      ],
    }).compile();

    service = module.get<ProviderServicesService>(ProviderServicesService);
    repository = module.get<Repository<ProviderService>>(getRepositoryToken(ProviderService));
    providersService = module.get<ProvidersService>(ProvidersService);
    servicesService = module.get<ServicesService>(ServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
