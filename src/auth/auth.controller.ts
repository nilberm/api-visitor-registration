import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCreateCredentialsDto } from './dto/auth-create-credentials.dto';
import { AuthLoginCredentialsDto } from './dto/auth-login-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body() authCreateCredentialsDto: AuthCreateCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCreateCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() authLoginCredentialsDto: AuthLoginCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authLoginCredentialsDto);
  }
}