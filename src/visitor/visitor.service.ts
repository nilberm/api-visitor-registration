import { Injectable } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { Visitor } from './entities/visitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitorGender } from './visitor-gender.enum';
import { GetVisitorByDayDto } from './dto/get-visitor-by-day';

export interface VisitorStatistics {
  totalVisits: number;
  uniqueVisitors: { count: number };
  visitorsByCity: { city: string; count: number }[];
  stateWithMostVisitors: { state: string; count: number };
  visitorsByGender: { gender: VisitorGender; count: number }[];
}
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

  async getVisitorsByState(): Promise<
    {
      date: { month: number; year: number };
      states: { state: string; count: number }[];
    }[]
  > {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 2;
    const startDate = `${currentYear}-02-01`;
    const endDate = `${currentYear}-${currentMonth}-01`;

    const rawResults = await this.visitorRepository
      .createQueryBuilder('visitor')
      .select('EXTRACT(MONTH FROM visitor.date)', 'month')
      .addSelect('EXTRACT(YEAR FROM visitor.date)', 'year')
      .addSelect('visitor.state', 'state')
      .addSelect('COUNT(*)', 'count')
      .where('visitor.date >= :startDate', { startDate })
      .andWhere('visitor.date <= :endDate', { endDate })
      .groupBy(
        'EXTRACT(MONTH FROM visitor.date), EXTRACT(YEAR FROM visitor.date), visitor.state',
      )
      .orderBy(
        'EXTRACT(YEAR FROM visitor.date), EXTRACT(MONTH FROM visitor.date), visitor.state',
      )
      .getRawMany();

    const formattedResults = rawResults.reduce((acc, curr) => {
      const { month, year, state, count } = curr;
      const date = { month: parseInt(month), year: parseInt(year) };
      const existingDateIndex = acc.findIndex(
        (item) =>
          item.date.month === date.month && item.date.year === date.year,
      );

      if (existingDateIndex !== -1) {
        acc[existingDateIndex].states.push({ state, count: parseInt(count) });
      } else {
        acc.push({ date, states: [{ state, count: parseInt(count) }] });
      }
      return acc;
    }, []);

    return formattedResults;
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

    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);

    const startDate = new Date(yearInt, monthInt, 1);
    const endDate = new Date(yearInt, monthInt + 1, 0);

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

  async getInformationToDownload(): Promise<VisitorStatistics> {
    const totalVisits = await this.visitorRepository.count();

    const uniqueVisitors = await this.visitorRepository
      .createQueryBuilder('visitor')
      .select('COUNT(DISTINCT visitor.cpf) as count')
      .getRawOne();

    const visitorsByCity = await this.visitorRepository
      .createQueryBuilder('visitor')
      .select('visitor.city, COUNT(visitor.id) as count')
      .groupBy('visitor.city')
      .getRawMany();

    const stateWithMostVisitors = await this.visitorRepository
      .createQueryBuilder('visitor')
      .select('visitor.state, COUNT(visitor.id) as count')
      .groupBy('visitor.state')
      .orderBy('count', 'DESC')
      .getRawOne();

    const visitorsByGender = await this.visitorRepository
      .createQueryBuilder('visitor')
      .select('visitor.gender, COUNT(visitor.id) as count')
      .groupBy('visitor.gender')
      .getRawMany();

    return {
      totalVisits,
      uniqueVisitors,
      visitorsByCity,
      stateWithMostVisitors,
      visitorsByGender,
    };
  }
}
