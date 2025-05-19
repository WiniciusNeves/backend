// filepath: src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '@/common/services/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  AuthModule
],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Certifique-se de exportar o UsersService
})
export class UsersModule {}