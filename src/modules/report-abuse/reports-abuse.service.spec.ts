import { Test, TestingModule } from '@nestjs/testing';
import { ReportsAbuseService } from './reports-abuse.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportAbuse } from './entities/report-abuse.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

const mockUsersService = {
  findOne: jest.fn(),
} as unknown as jest.Mocked<UsersService>;

describe('ReportsAbuseService', () => {
  let service: ReportsAbuseService;
  let repository: jest.Mocked<Repository<ReportAbuse>>;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsAbuseService,
        { provide: getRepositoryToken(ReportAbuse), useFactory: mockRepository },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<ReportsAbuseService>(ReportsAbuseService);
    repository = module.get(getRepositoryToken(ReportAbuse));
    usersService = module.get(UsersService);
  });

  it('should create a report successfully', async () => {
    const createReportDto = { userId: 1, name: 'Test', email: 'test@example.com', description: 'Test description' };
    const user = { id: 1, name: 'Test User' };
    const report = { id: 1, ...createReportDto, user };

    usersService.findOne.mockResolvedValue(user as any);
    repository.create.mockReturnValue(report as any);
    repository.save.mockResolvedValue(report as any);

    const result = await service.create(createReportDto);
    expect(usersService.findOne).toHaveBeenCalledWith(1);
    expect(repository.create).toHaveBeenCalledWith({ ...createReportDto, user });
    expect(repository.save).toHaveBeenCalledWith(report);
    expect(result).toEqual(report);
  });
});

