import {
  Post,
  Body,
  Req,
  Res,
  Get,
  Controller,
  ForbiddenException,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import AuthDecorator from 'src/decorator/auth.decorator';
import SignUpAuthDto from './dto/sign-up-auth.dto';
import SignInAuthDto from './dto/sign-in-auth.dto';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { ChangePasswordDto } from 'src/validators/changePassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @AuthDecorator()
  @Post('signup')
  async signUp(
    @Body() signUpAuthDto: SignUpAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signUp(signUpAuthDto, res);
  }

  @AuthDecorator()
  @Post('login')
  async login(
    @Body() signInAuthDto: SignInAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(signInAuthDto, res);
  }

  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { userId } = req.user;
    return this.authService.logout(userId, res);
  }

  @Patch('change-password')
  changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.userId, changePasswordDto);
  }

  @AuthDecorator()
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const [type, refreshToken] = req.headers?.authorization?.split(' ') || [];
    if (type !== 'Refresh') throw new ForbiddenException('Invalid token type');
    return this.authService.refreshToken(refreshToken, res);
  }

  @Get('me')
  async getMe(@Req() req) {
    const { userId, role } = req.user;
    return this.authService.getMe(userId, role);
  }
}
