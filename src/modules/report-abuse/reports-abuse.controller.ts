import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportsAbuseService } from './reports-abuse.service';
import { CreateReportAbuseDto } from './dto/create-report-abuse.dto';
import { UpdateReportAbuseDto } from './dto/update-report-abuse.dto';

@Controller('reports-abuse')
export class ReportsAbuseController {
  constructor(private readonly reportsAbuseService: ReportsAbuseService) {}

  @Post()
  create(@Body() createReportAbuseDto: CreateReportAbuseDto) {
    return this.reportsAbuseService.create(createReportAbuseDto);
  }

  @Get()
  findAll() {
    return this.reportsAbuseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsAbuseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportAbuseDto: UpdateReportAbuseDto) {
    return this.reportsAbuseService.update(+id, updateReportAbuseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsAbuseService.remove(+id);
  }
}
