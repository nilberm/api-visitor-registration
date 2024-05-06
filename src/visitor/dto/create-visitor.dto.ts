import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { VisitorGender } from '../visitor-gender.enum';
import { IsCPF } from '../validators/is-cpf.validator';

export class CreateVisitorDto {
  @IsNotEmpty()
  @Length(2, 30)
  name: string;

  @IsNotEmpty()
  @IsEnum(VisitorGender)
  gender: VisitorGender;

  @IsNotEmpty()
  age: number;

  @IsNotEmpty()
  occupation: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  @IsCPF({ message: 'CPF inválido' })
  cpf: string;
}
