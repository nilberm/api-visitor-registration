import { Injectable } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { Visitor } from './entities/visitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VisitorService {
  constructor(
    @InjectRepository(Visitor)
    private visitorRepository: Repository<Visitor>,
  ) {}
  async create(createVisitorDto: CreateVisitorDto): Promise<Visitor> {
    const currentDate = new Date();

    const visitor = this.visitorRepository.create(createVisitorDto);

    await this.visitorRepository.save({
      ...visitor,
      date: currentDate,
    });

    return visitor;
  }

  async findAll() {
    const query = this.visitorRepository.createQueryBuilder('visitor');

    const visitors = await query.getMany();

    return visitors;
  }
}
