import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(), // Simula o método create
    save: jest.fn(),   // Simula o método save
    findOne: jest.fn(), // Simula o método findOne
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User), // Mock do UserRepository
          useValue: mockUserRepository,     // Use o mock explícito
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      profile_picture: 'test.jpg',
      password: 'password',
      role: Role.COMMON,
      whatsapp: '1234567890',
    };

    const mockUser = {
      id: 1,
      ...createUserDto,
      created_at: new Date(),
    };

    // Simula o comportamento do método save
    mockUserRepository.save.mockResolvedValue(mockUser);

    const result = await controller.create(createUserDto);

    expect(result).toEqual({
      id: 1,
      ...createUserDto,
      created_at: expect.any(Date),
    });
  });
});
