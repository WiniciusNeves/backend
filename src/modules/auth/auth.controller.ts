import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verifyEmailDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  logout(@Body('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token não fornecido');
    }
    return this.authService.logout(token);
  }

  @Post('refresh-token')
  refreshToken(@Body('oldToken') oldToken: string) {
    if (!oldToken) {
      throw new BadRequestException('Token antigo não fornecido');
    }
    return this.authService.refreshToken(oldToken);
  }

  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('E-mail não fornecido');
    }
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    if (!token || !newPassword) {
      throw new BadRequestException('Token e nova senha são obrigatórios');
    }
    return this.authService.resetPassword(token, newPassword);
  }

  @Post('verify-email')
  verifyEmail(@Body('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token não fornecido');
    }
    return this.authService.verifyEmail(token);
  }

  @Post('google')
  loginWithGoogle(@Body('idToken') idToken: string) {
    if (!idToken) {
      throw new BadRequestException('ID Token do Google não fornecido');
    }
    return this.authService.loginWithGoogle(idToken);
  }

  @Post('send-verification-code')
  sendVerificationCode(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('E-mail não fornecido');
    }
    return this.authService.sendVerificationCode(email);
  }

  @Post('verify-email-code')
  verifyEmailCode(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmailCode(verifyEmailDto);
  }
}
