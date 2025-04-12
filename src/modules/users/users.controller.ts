// src/modules/users/users.controller.ts

import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req) {
    return req.user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Put(':id/password')
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body('password') password: string,
  ) {
    await this.usersService.updatePassword(id, password);
    return { message: 'Senha atualizada com sucesso' };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return { message: 'Usuário removido com sucesso' };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/upload-profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadProfileImage(file, id);
  }
}
