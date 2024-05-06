import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { VisitorGender } from '../visitor-gender.enum';

@Entity()
export class Visitor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  gender: VisitorGender;

  @Column()
  age: number;

  @Column()
  occupation: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  cpf: string;

  @Column()
  date: Date;
}
