import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderServicesService } from './provider-services.service';
import { ProviderServicesController } from './provider-services.controller';
import { ProviderService } from './entities/provider-service.entity';
import { ProvidersModule } from '../providers/providers.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProviderService]),
    ProvidersModule,
    ServicesModule,
  ],
  controllers: [ProviderServicesController],
  providers: [ProviderServicesService],
  exports: [ProviderServicesService],
})
export class ProviderServicesModule {}
