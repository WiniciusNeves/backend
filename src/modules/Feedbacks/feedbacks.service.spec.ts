import { Test, TestingModule } from '@nestjs/testing';
import { FeedbacksService } from './feedbacks.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { ProvidersService } from '../providers/providers.service';
import { ServicesService } from '../services/services.service';
import { UsersService } from '../users/users.service';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('FeedbacksService', () => {
  let service: FeedbacksService;
  let repository: Repository<Feedback>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbacksService,
        { provide: getRepositoryToken(Feedback), useFactory: mockRepository },
        { provide: ProvidersService, useValue: {} },
        { provide: ServicesService, useValue: {} },
        { provide: UsersService, useValue: {} },
      ],
    }).compile();

    service = module.get<FeedbacksService>(FeedbacksService);
    repository = module.get<Repository<Feedback>>(getRepositoryToken(Feedback));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
