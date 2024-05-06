import { Module } from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { VisitorController } from './visitor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visitor } from './entities/visitor.entity';

@Module({
  controllers: [VisitorController],
  providers: [VisitorService],
  imports: [TypeOrmModule.forFeature([Visitor])],
})
export class VisitorModule {}
