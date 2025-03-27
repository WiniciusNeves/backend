import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  // @Post('register')
  // async register(@Body() createUserDto: CreateUserDto): Promise<User> {
  //   return this.userService.createUser(createUserDto);
  // }

  // @Put('update/:id')
  // async update(@Body() updateUserDto: Partial<CreateUserDto>, @Param('id') id: number): Promise<User> {
  //   return this.userService.update(id, updateUserDto);
  // }

  
  // @Post('logout')
  // async logout(): Promise<void> {
  //   return this.authService.logout();
  // }
}
