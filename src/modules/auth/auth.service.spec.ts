import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../users/entities/user.entity';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2b$10$mockedHashedPassword'),
  compare: jest.fn().mockResolvedValue(true), // Mock do método compare
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-jwt-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return JWT token', async () => {
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '11987654321',
        whatsapp: '11987654321',
        password: 'password123',
        profile_picture: 'https://example.com/profile.jpg',
        role: Role.COMMON,
      };

      const hashedPassword = '$2b$10$mockedHashedPassword'; // Valor fixo para o hash
      const savedUser = { id: 1, ...registerDto, password: hashedPassword };

      (usersService.create as jest.Mock).mockResolvedValue(savedUser);
      (jwtService.sign as jest.Mock).mockReturnValue('fake-jwt-token');

      const result = await authService.register(registerDto);

      expect(usersService.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword, // Verifica o hash fixo
      });

      expect(jwtService.sign).toHaveBeenCalledWith({ id: savedUser.id, email: savedUser.email });

      expect(result).toEqual({
        access_token: 'fake-jwt-token',
        user: savedUser,
      });
    });
  });

  describe('login', () => {
    it('should validate user credentials and return JWT token', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      const foundUser = { id: 1, email: loginDto.email, password: hashedPassword };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(foundUser);

      const result = await authService.login(loginDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(result).toEqual({
        access_token: 'fake-jwt-token',
        user: foundUser,
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });
});
