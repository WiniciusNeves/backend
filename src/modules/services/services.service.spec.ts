import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { CategoriesService } from '../categories/categories.service';

const mockServiceRepository = jest.mocked({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
} as Partial<Repository<Service>>);

const mockCategoryService = jest.mocked({
  findOne: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
} as Partial<CategoriesService>);

describe('ServicesService', () => {
  let service: ServicesService;
  let repository: jest.Mocked<Repository<Service>>;
  let categoryService: jest.Mocked<CategoriesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        { provide: getRepositoryToken(Service), useValue: mockServiceRepository },
        { provide: CategoriesService, useValue: mockCategoryService },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    repository = module.get<jest.Mocked<Repository<Service>>>(getRepositoryToken(Service));
    categoryService = module.get<jest.Mocked<CategoriesService>>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a service', async () => {
    const serviceDto = { title: 'Plumbing Repair', description: 'Fix leaks', categoryId: 1 };
    const category = { id: 1, name: 'Plumbing' };
    const newService = { id: 1, ...serviceDto, category };

    categoryService.findOne.mockResolvedValue(category as any);
    repository.create.mockReturnValue(newService as any);
    repository.save.mockResolvedValue(newService as any);

    const result = await service.create(serviceDto);
    expect(categoryService.findOne).toHaveBeenCalledWith(1);
    expect(repository.create).toHaveBeenCalledWith({ ...serviceDto, category });
    expect(repository.save).toHaveBeenCalledWith(newService);
    expect(result).toEqual(newService);
  });

  it('should return all services', async () => {
    const services = [{ id: 1, title: 'Plumbing Repair', description: 'Fix leaks' }];
    repository.find.mockResolvedValue(services as any);

    const result = await service.findAll();
    expect(repository.find).toHaveBeenCalled();
    expect(result).toEqual(services);
  });

  it('should find one service', async () => {
    const serviceData = { id: 1, title: 'Plumbing Repair', description: 'Fix leaks' };
    repository.findOne.mockResolvedValue(serviceData as any);

    const result = await service.findOne(1);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(serviceData);
  });

  it('should throw error when service not found', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow('Service not found');
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
  });

  it('should update a service', async () => {
    const updateDto = { title: 'Advanced Plumbing', description: 'Updated description' };
    const updatedService = { id: 1, title: 'Advanced Plumbing', description: 'Updated description' };

    repository.findOne.mockResolvedValue(updatedService as any);
    repository.update.mockResolvedValue({ affected: 1 } as any);

    const result = await service.update(1, updateDto);
    expect(repository.update).toHaveBeenCalledWith(1, updateDto);
    expect(result).toEqual(updatedService);
  });

  it('should delete a service', async () => {
    const serviceData = { id: 1, title: 'Plumbing Repair', description: 'Fix leaks' };

    repository.findOne.mockResolvedValue(serviceData as any);
    repository.remove.mockResolvedValue(serviceData as any);

    const result = await service.remove(1);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repository.remove).toHaveBeenCalledWith(serviceData);
    expect(result).toEqual(serviceData);
  });
});