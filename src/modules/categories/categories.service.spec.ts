import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

const mockCategoryRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: jest.Mocked<Repository<Category>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getRepositoryToken(Category), useValue: mockCategoryRepository },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a category', async () => {
    const categoryDto = { name: 'Plumbing' };
    const category = { id: 1, name: 'Plumbing', createdAt: new Date() };

    repository.create.mockReturnValue(category as any);
    repository.save.mockResolvedValue(category as any);

    const result = await service.create(categoryDto);
    expect(repository.create).toHaveBeenCalledWith(categoryDto);
    expect(repository.save).toHaveBeenCalledWith(category);
    expect(result).toEqual(category);
  });

  it('should return all categories', async () => {
    const categories = [{ id: 1, name: 'Plumbing' }];
    repository.find.mockResolvedValue(categories as any);

    const result = await service.findAll();
    expect(repository.find).toHaveBeenCalled();
    expect(result).toEqual(categories);
  });

  it('should find one category', async () => {
    const category = { id: 1, name: 'Plumbing' };
    repository.findOne.mockResolvedValue(category as any);

    const result = await service.findOne(1);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['services'] });
    expect(result).toEqual(category);
  });

  it('should throw error when category not found', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow('Category not found');
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 999 },
      relations: ['services'], // Inclua as relações esperadas
    });
  });

  it('should update a category', async () => {
    const updateDto = { name: 'Electrician' };
    const updatedCategory = { id: 1, name: 'Electrician' };

    repository.findOne.mockResolvedValue(updatedCategory as any);
    repository.update.mockResolvedValue({ affected: 1 } as any);

    const result = await service.update(1, updateDto);
    expect(repository.update).toHaveBeenCalledWith(1, updateDto); // Passe o ID diretamente
    expect(result).toEqual(updatedCategory);
  });

  it('should delete a category', async () => {
    const category = { id: 1, name: 'Plumbing' };

    repository.findOne.mockResolvedValue(category as any);
    repository.remove.mockResolvedValue(category as any);

    const result = await service.remove(1);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['services'], // Inclua as relações esperadas
    });
    expect(repository.remove).toHaveBeenCalledWith(category);
    expect(result).toEqual(category);
  });
});