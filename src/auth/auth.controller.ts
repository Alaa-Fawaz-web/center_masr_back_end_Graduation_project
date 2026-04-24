import { Post, Body, Req, Res, Get, Controller } from '@nestjs/common';
import AuthDecorator from 'src/decorator/auth.decorator';
import SignUpAuthDto from './dto/sign-up-auth.dto';
import SignInAuthDto from './dto/sign-in-auth.dto';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up' })
  @AuthDecorator()
  @Post('signup')
  async signUp(
    @Body() signUpAuthDto: SignUpAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signUp(signUpAuthDto, res);
  }

  @ApiOperation({ summary: 'Sign in' })
  @AuthDecorator()
  @Post('login')
  async login(
    @Body() signInAuthDto: SignInAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(signInAuthDto, res);
  }

  @ApiOperation({ summary: 'Logout' })
  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { userId } = req.user;
    return this.authService.logout(userId, res);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @AuthDecorator()
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { refreshToken } = req.cookies;
    return this.authService.refreshToken(refreshToken, res);
  }

  @ApiOperation({ summary: 'me-user' })
  @Get('me')
  async getMe(@Req() req) {
    const { userId, role } = req.user;
    return this.authService.getMe(userId, role);
  }
}
