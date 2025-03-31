import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersService } from './providers.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';

const mockProviderRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockUsersService = {
  findOne: jest.fn(),
};

describe('ProvidersService', () => {
  let service: ProvidersService;
  let repository: jest.Mocked<Repository<Provider>>;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvidersService,
        { provide: getRepositoryToken(Provider), useValue: mockProviderRepository },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<ProvidersService>(ProvidersService);
    repository = module.get<jest.Mocked<Repository<Provider>>>(getRepositoryToken(Provider));
    usersService = module.get<jest.Mocked<UsersService>>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a provider', async () => {
    const createProviderDto = {
      user_id: 1,
      cpf_cnpj: '12345678901',
      description: 'Test Provider',
      date_of_birth: '1990-01-01', // Adicionado
      address: '123 Main St', // Adicionado
    };
    const user = { id: 1, name: 'Test User' };
    const provider = { id: 1, ...createProviderDto, user };

    usersService.findOne.mockResolvedValue(user as any);
    repository.create.mockReturnValue(provider as any);
    repository.save.mockResolvedValue(provider as any);

    const result = await service.create(createProviderDto);
    expect(usersService.findOne).toHaveBeenCalledWith(1);
    expect(repository.create).toHaveBeenCalledWith({ ...createProviderDto, user });
    expect(repository.save).toHaveBeenCalledWith(provider);
    expect(result).toEqual(provider);
  });

  it('should throw NotFoundException if user not found', async () => {
    const createProviderDto = {
      user_id: 999,
      cpf_cnpj: '12345678901',
      description: 'Test Provider',
      date_of_birth: '1990-01-01', // Adicionado
      address: '123 Main St', // Adicionado
    };

    usersService.findOne.mockResolvedValue(null);

    await expect(service.create(createProviderDto)).rejects.toThrow(NotFoundException);
    expect(usersService.findOne).toHaveBeenCalledWith(999);
  });

  it('should return all providers', async () => {
    const providers = [{ id: 1, description: 'Test Provider', user: { id: 1, name: 'Test User' } }];
    repository.find.mockResolvedValue(providers as any);

    const result = await service.findAll();
    expect(repository.find).toHaveBeenCalledWith({ relations: ['user'] });
    expect(result).toEqual(providers);
  });

  it('should return a provider if found', async () => {
    const provider = { id: 1, description: 'Test Provider', user: { id: 1, name: 'Test User' } };
    repository.findOne.mockResolvedValue(provider as any);

    const result = await service.findOne(1);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['user'] });
    expect(result).toEqual(provider);
  });

  it('should throw NotFoundException if provider not found', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 }, relations: ['user'] });
  });

  it('should update a provider and return it', async () => {
    const updateProviderDto = { description: 'Updated Provider' };
    const provider = { id: 1, description: 'Test Provider', user: { id: 1, name: 'Test User' } };
    const updatedProvider = { ...provider, ...updateProviderDto };

    repository.findOne.mockResolvedValue(provider as any);
    repository.save.mockResolvedValue(updatedProvider as any);

    const result = await service.update(1, updateProviderDto);
    expect(repository.save).toHaveBeenCalledWith(updatedProvider);
    expect(result).toEqual(updatedProvider);
  });

  it('should remove a provider', async () => {
    const provider = { id: 1, description: 'Test Provider', user: { id: 1, name: 'Test User' } };

    repository.findOne.mockResolvedValue(provider as any);
    repository.remove.mockResolvedValue(provider as any);

    const result = await service.remove(1);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['user'] });
    expect(repository.remove).toHaveBeenCalledWith(provider);
    expect(result).toEqual(provider);
  });
});