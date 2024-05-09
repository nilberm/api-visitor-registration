import { Module } from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { VisitorController } from './visitor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visitor } from './entities/visitor.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [VisitorController],
  providers: [VisitorService, JwtService],
  imports: [TypeOrmModule.forFeature([Visitor])],
})
export class VisitorModule {}
