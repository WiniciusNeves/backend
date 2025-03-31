import { IsNotEmpty, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  serviceId: number;

  @IsNotEmpty()
  providerId: number;

  @IsNotEmpty()
  userId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
