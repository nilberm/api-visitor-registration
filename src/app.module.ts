import { Module } from '@nestjs/common';

import { VisitorModule } from './visitor/visitor.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    VisitorModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'visitor-registration',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
