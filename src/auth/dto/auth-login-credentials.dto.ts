import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthLoginCredentialsDto {
  @IsEmail()
  @IsString()
  @ApiProperty({
    example: 'test@teste.com',
    description: 'A valid email address of the user',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  @ApiProperty({
    example: '123@Abc',
    description: `Must be at least eight characters long, must contain uppercase letters, lowercase letters, numbers and symbols`,
  })
  password: string;
}
