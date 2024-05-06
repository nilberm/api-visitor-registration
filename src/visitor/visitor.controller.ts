import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { VisitorService } from './visitor.service';
import { Visitor } from './entities/visitor.entity';

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
}
