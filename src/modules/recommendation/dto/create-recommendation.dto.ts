import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateRecommendationDto {
  @IsNotEmpty()
  serviceId: number;

  @IsNotEmpty()
  userId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  stars: number;
}
