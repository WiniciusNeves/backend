import { PartialType } from '@nestjs/mapped-types';
import { CreateReportAbuseDto } from './create-report-abuse.dto';

export class UpdateReportAbuseDto extends PartialType(CreateReportAbuseDto) {}
