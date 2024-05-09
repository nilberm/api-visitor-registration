import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { VisitorService } from './visitor.service';
import { Visitor } from './entities/visitor.entity';
import { VisitorGender } from './visitor-gender.enum';
import { GetVisitorByDayDto } from './dto/get-visitor-by-day';

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  create(@Body() createVisitorDto: CreateVisitorDto): Promise<Visitor> {
    return this.visitorService.create(createVisitorDto);
  }

  @Get()
  findAll(): Promise<Visitor[]> {
    return this.visitorService.findAll();
  }

  @Get('/by-cities')
  findVisitorByCities(): Promise<{ city: string; count: number }[]> {
    return this.visitorService.getVisitorsByCity();
  }

  @Get('/by-states')
  findVisitorByStates(): Promise<{ state: string; count: number }[]> {
    return this.visitorService.getVisitorsByState();
  }

  @Get('/by-gender')
  findVisitorByGenders(): Promise<{ gender: VisitorGender; count: number }[]> {
    return this.visitorService.getVisitorsByGender();
  }

  @Get('/by-day')
  findVisitorByDay(
    @Body() getVisitorByDayDto: GetVisitorByDayDto,
  ): Promise<{ date: string; count: number }[]> {
    return this.visitorService.getVisitorsByDay(getVisitorByDayDto);
  }

  @Get('/by-month')
  findVisitorByMonth(): Promise<{ date: string; count: number }[]> {
    return this.visitorService.getVisitorsByMonth();
  }
}
