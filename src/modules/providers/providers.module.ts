import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    UsersModule, 
    CategoriesModule, // Adicionado ao array de imports
    TypeOrmModule.forFeature([Provider]),
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService],
  exports: [ProvidersService],
})
export class ProvidersModule {}