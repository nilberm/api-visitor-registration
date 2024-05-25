import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { VisitorGender } from '../visitor-gender.enum';
import { IsCPF } from '../validators/is-cpf.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVisitorDto {
  @IsNotEmpty()
  @Length(2, 30)
  @ApiProperty({
    example: 'Nilber Mota',
    description:
      'The username must be at least two characters long and have a maximum length of thirty characters.',
  })
  name: string;

  @IsNotEmpty()
  @IsEnum(VisitorGender)
  @ApiProperty({
    enum: ['male', 'female', 'other', 'uninformed'],
    description:
      'The gender must be one of the following values: male, female, other, uninformed.',
  })
  gender: VisitorGender;

  @IsNotEmpty()
  @ApiProperty({
    example: 25,
  })
  age: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Developer',
  })
  occupation: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Fortaleza',
  })
  city: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Ceará',
  })
  state: string;

  @IsNotEmpty()
  @IsCPF({ message: 'CPF inválido' })
  @ApiProperty({
    example: '000.000.000-00',
    description: 'The CPF must be a valid CPF number.',
  })
  cpf: string;
}
