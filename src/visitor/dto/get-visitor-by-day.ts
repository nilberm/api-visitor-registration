import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class GetVisitorByDayDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(11)
  month: number;

  @IsNotEmpty()
  @IsInt()
  year: number;
}
