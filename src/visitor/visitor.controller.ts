import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { VisitorService, VisitorStatistics } from './visitor.service';
import { Visitor } from './entities/visitor.entity';
import { VisitorGender } from './visitor-gender.enum';
import { GetVisitorByDayDto } from './dto/get-visitor-by-day';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  @IsPublic()
  create(@Body() createVisitorDto: CreateVisitorDto): Promise<Visitor> {
    return this.visitorService.create(createVisitorDto);
  }

  @Get()
  @IsPublic()
  findAll(): Promise<Visitor[]> {
    return this.visitorService.findAll();
  }

  @Get('/by-cities')
  findVisitorByCities(): Promise<{ city: string; count: number }[]> {
    return this.visitorService.getVisitorsByCity();
  }

  @Get('/by-states')
  findVisitorByStates(): Promise<
    {
      date: { month: number; year: number };
      states: { state: string; count: number }[];
    }[]
  > {
    return this.visitorService.getVisitorsByState();
  }

  @Get('/by-gender')
  findVisitorByGenders(): Promise<{ gender: VisitorGender; count: number }[]> {
    return this.visitorService.getVisitorsByGender();
  }

  @Get('/by-day')
  findVisitorByDay(
    @Query() getVisitorByDayDto: GetVisitorByDayDto,
  ): Promise<{ date: string; count: number }[]> {
    return this.visitorService.getVisitorsByDay(getVisitorByDayDto);
  }

  @IsPublic()
  @Get('/by-month')
  findVisitorByMonth(): Promise<{ date: string; count: number }[]> {
    return this.visitorService.getVisitorsByMonth();
  }

  @Get('/to-download')
  findInformationToDownload(): Promise<VisitorStatistics> {
    return this.visitorService.getInformationToDownload();
  }
}
