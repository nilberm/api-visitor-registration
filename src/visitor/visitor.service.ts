import { Injectable } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { Visitor } from './entities/visitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitorGender } from './visitor-gender.enum';
import { GetVisitorByDayDto } from './dto/get-visitor-by-day';

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

  async getVisitorsByCity(): Promise<{ city: string; count: number }[]> {
    return await this.visitorRepository
      .createQueryBuilder('visitor')
      .select('visitor.city', 'city')
      .addSelect('COUNT(*)', 'count')
      .groupBy('visitor.city')
      .getRawMany();
  }

  async getVisitorsByState(): Promise<{ state: string; count: number }[]> {
    return await this.visitorRepository
      .createQueryBuilder('visitor')
      .select('visitor.state', 'state')
      .addSelect('COUNT(*)', 'count')
      .groupBy('visitor.state')
      .getRawMany();
  }

  async getVisitorsByGender(): Promise<
    { gender: VisitorGender; count: number }[]
  > {
    return await this.visitorRepository
      .createQueryBuilder('visitor')
      .select('visitor.gender', 'gender')
      .addSelect('COUNT(*)', 'count')
      .groupBy('visitor.gender')
      .getRawMany();
  }

  async getVisitorsByDay(
    getVisitorByDayDto: GetVisitorByDayDto,
  ): Promise<{ date: string; count: number }[]> {
    const { month, year } = getVisitorByDayDto;

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const visitorsByDay = await this.visitorRepository
      .createQueryBuilder('visitor')
      .select('DATE(visitor.date) AS date')
      .addSelect('COUNT(*) AS count')
      .where('visitor.date >= :startDate', { startDate })
      .andWhere('visitor.date <= :endDate', { endDate })
      .groupBy('DATE(visitor.date)')
      .orderBy('DATE(visitor.date)', 'ASC')
      .getRawMany();

    return visitorsByDay.map(({ date, count }) => ({
      date: date,
      count: parseInt(count),
    }));
  }

  async getVisitorsByMonth(): Promise<{ date: string; count: number }[]> {
    const visitorsByMonth = await this.visitorRepository
      .createQueryBuilder('visitor')
      .select("to_char(visitor.date, 'YYYY-MM') AS date")
      .addSelect('COUNT(*) AS count')
      .groupBy("to_char(visitor.date, 'YYYY-MM')")
      .orderBy("to_char(visitor.date, 'YYYY-MM')", 'ASC')
      .getRawMany();

    return visitorsByMonth.map(({ date, count }) => ({
      date: date,
      count: parseInt(count),
    }));
  }
}
