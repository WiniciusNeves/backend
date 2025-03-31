import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsAbuseService } from './reports-abuse.service';
import { ReportsAbuseController } from './reports-abuse.controller';
import { ReportAbuse } from './entities/report-abuse.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportAbuse]),
    UsersModule,
  ],
  controllers: [ReportsAbuseController],
  providers: [ReportsAbuseService],
  exports: [ReportsAbuseService],
})
export class ReportsAbuseModule {}
