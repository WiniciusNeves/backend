// src/modules/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByEmailOrWhatsapp(email: string, whatsapp: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: [{ email }, { whatsapp }],
    });
    return user ?? undefined;
  }

  findOne(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  findAll() {
    return this.usersRepository.find();
  }

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersRepository.save({ id, ...updateUserDto });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
