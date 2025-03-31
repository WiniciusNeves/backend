import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ServicesModule } from './modules/services/services.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { ProviderServicesModule } from './modules/ProviderServicesService/provider-services.module';
import { FeedbacksModule } from './modules/Feedbacks/feedbacks.module';
import { RecommendationsModule } from './modules/recommendation/recommendations.module';
import { ReportsAbuseModule } from './modules/report-abuse/reports-abuse.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity.{js,ts}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    ServicesModule,
    ProvidersModule,
    ProviderServicesModule, 
    FeedbacksModule,
    RecommendationsModule,
    ReportsAbuseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

