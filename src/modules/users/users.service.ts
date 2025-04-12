import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { bucket } from 'src/config/firebase.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async uploadProfileImage(file: Express.Multer.File, userId: number): Promise<{ imageUrl: string }> {
    const fileName = `profile-images/${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    await fileUpload.makePublic();
    const imageUrl = fileUpload.publicUrl();

    await this.usersRepository.update(userId, { profile_picture: imageUrl });
    return { imageUrl };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByEmailOrWhatsapp(email: string, whatsapp: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: [{ email }, { whatsapp }],
    });
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { emailVerificationToken: token } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Atualiza o campo de verificação de e-mail
    user.isEmailVerified = true; // Certifique-se de que o campo existe na entidade User
    user.emailVerificationToken = null; // Opcional: invalida o token após a verificação

    await this.usersRepository.save(user);
  }
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updatePassword(id: number, password: string): Promise<void> {
    await this.usersRepository.update(id, { password });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}

