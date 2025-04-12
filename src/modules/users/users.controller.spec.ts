import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

jest.mock('../../config/firebase.config', () => ({
  bucket: {
    file: jest.fn().mockReturnThis(),
    save: jest.fn(),
  },
}));

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockUsersService = {
    create: jest.fn(),
    uploadProfileImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
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

    mockUsersService.create.mockResolvedValue(mockUser);

    const result = await controller.create(createUserDto);

    expect(result).toEqual(mockUser);
    expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should upload a profile image', async () => {
    const mockFile = {
      originalname: 'photo.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test'),
    } as unknown as Express.Multer.File;

    const mockResponse = {
      imageUrl: 'https://firebase/storage/photo.jpg',
    };

    // Simula o método da service
    jest.spyOn(service, 'uploadProfileImage').mockResolvedValue(mockResponse);

    const result = await controller.uploadProfileImage(1, mockFile);

    expect(result).toEqual(mockResponse);
    expect(service.uploadProfileImage).toHaveBeenCalledWith(mockFile, 1);
  });
});
