import { IsNotEmpty, IsString } from 'class-validator';

export class GetVisitorByDayDto {
  @IsNotEmpty()
  @IsString()
  month: string;

  @IsNotEmpty()
  @IsString()
  year: string;
}
