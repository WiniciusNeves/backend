import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportAbuse } from './entities/report-abuse.entity';
import { CreateReportAbuseDto } from './dto/create-report-abuse.dto';
import { UpdateReportAbuseDto } from './dto/update-report-abuse.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReportsAbuseService {
  constructor(
    @InjectRepository(ReportAbuse)
    private readonly reportAbuseRepository: Repository<ReportAbuse>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateReportAbuseDto) {
    const user = await this.usersService.findOne(dto.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const report = this.reportAbuseRepository.create({ ...dto, user });
    return this.reportAbuseRepository.save(report);
  }

  async findAll() {
    return this.reportAbuseRepository.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    const report = await this.reportAbuseRepository.findOne({ where: { id }, relations: ['user'] });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }

  async update(id: number, dto: UpdateReportAbuseDto) {
    const report = await this.findOne(id);
    Object.assign(report, dto);
    return this.reportAbuseRepository.save(report);
  }

  async remove(id: number) {
    const report = await this.findOne(id);
    return this.reportAbuseRepository.remove(report);
  }
}
