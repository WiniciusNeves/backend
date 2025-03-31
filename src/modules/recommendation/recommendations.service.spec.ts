import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsService } from './recommendations.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Recommendation } from './entities/recommendation.entity';
import { UsersService } from '../users/users.service';
import { ServicesService } from '../services/services.service';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('RecommendationsService', () => {
  let service: RecommendationsService;
  let repository: Repository<Recommendation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        { provide: getRepositoryToken(Recommendation), useFactory: mockRepository },
        { provide: UsersService, useValue: {} },
        { provide: ServicesService, useValue: {} },
      ],
    }).compile();

    service = module.get<RecommendationsService>(RecommendationsService);
    repository = module.get<Repository<Recommendation>>(getRepositoryToken(Recommendation));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
