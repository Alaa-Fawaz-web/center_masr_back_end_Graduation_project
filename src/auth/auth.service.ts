import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { roleTeacherAndCenterSet, sendResponsive, STUDENT } from 'src/utils';
import SignUpAuthDto from './dto/sign-up-auth.dto';
import SignInAuthDto from './dto/sign-in-auth.dto';
import { PayloadTokenType } from 'src/types/type';
import { PrismaService } from '../prisma.service';
import AppConfig from '../config/app.config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private config: AppConfig,
  ) {}

  toUpperCase(str: string) {
    const data = str.slice(0, 1).toUpperCase() + str.slice(1);

    return `profile${data}`;
  }

  async signUp(signUpAuthDto: SignUpAuthDto, res: Response) {
    const { email, role } = signUpAuthDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new BadRequestException('Email already in use');

    return await this.prisma.$transaction(async (prisma) => {
      const hashedPassword = await hash(signUpAuthDto.password, 10);
      const user = await prisma.user.create({
        data: { ...signUpAuthDto, password: hashedPassword },
      });

      const userId = user.id;
      const data = { data: { userId } };
      let roleModel = await prisma[`${role}`].create(data);

      if (roleTeacherAndCenterSet.has(role)) {
        await prisma[this.toUpperCase(role)].create(data);
      }

      const payload: PayloadTokenType = {
        userId,
        profileId: roleModel.id,
        role,
      };

      const accessToken = await this.JWTSign(payload);

      const refreshToken = await this.JWTSign(payload, true);

      const hashRefreshToken = await hash(refreshToken, 12);

      await prisma.refreshToken.upsert({
        where: { userId },
        update: { token: hashRefreshToken },
        create: { userId, token: hashRefreshToken },
      });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      return sendResponsive(
        {
          id: userId,
          name: user.name,
          imageUrl: user.imageUrl,
          role: role,
          profileId: roleModel.id,
        },
        'Logged in successfully',
        {
          accessToken,
          refreshToken,
        },
      );
    });
  }

  async login(signInAuthDto: SignInAuthDto, res: Response) {
    const { email, password } = signInAuthDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        password: true,
        role: true,

        teacher: {
          select: {
            id: true,
          },
        },
        center: {
          select: {
            id: true,
          },
        },
        student: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    let profileId = user[`${user.role}`]?.id;
    let { id: userId, role } = user;

    const payload: PayloadTokenType = {
      userId,
      profileId,
      role,
    };

    const accessToken = await this.JWTSign(payload);

    const refreshToken = await this.JWTSign(payload, true);

    const hashRefreshToken = await hash(refreshToken, 12);

    await this.prisma.refreshToken.upsert({
      where: { userId },
      update: { token: hashRefreshToken },
      create: { userId, token: hashRefreshToken },
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return sendResponsive(
      {
        id: userId,
        name: user.name,
        imageUrl: user.imageUrl,
        role: role,
        profileId,
      },
      'Logged in successfully',
      {
        accessToken,
        refreshToken,
      },
    );
  }

  async logout(userId: string, res: Response) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });

    res.clearCookie('accessToken').clearCookie('refreshToken');

    return sendResponsive(null, 'Logged out successfully');
  }

  async refreshToken(oldToken: string, res: Response) {
    let payload: PayloadTokenType;

    try {
      payload = await this.jwtService.verifyAsync(oldToken, {
        secret: this.config.jwtRefreshSecret,
      });
    } catch {
      throw new ForbiddenException('Invalid refresh token');
    }

    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { userId: payload.userId },
    });

    if (!tokenRecord) throw new ForbiddenException('Invalid refresh token');

    const isMatch = await compare(oldToken, tokenRecord.token);
    if (!isMatch) throw new ForbiddenException('Invalid refresh token');

    const newAccessToken = await this.jwtService.signAsync({
      userId: payload.userId,
      profileId: payload.profileId,
      role: payload.role,
    });

    res.cookie('accessToken', newAccessToken);

    return sendResponsive(null, 'refresh token successfully');
  }

  async getMe(userId: string, role: string) {
    const include = {};

    const includeAndOmit = {
      include: true,
      omit: { userId: true },
    };
    include[role] = includeAndOmit;
    if (roleTeacherAndCenterSet.has(role))
      include[`profile_${role}`] = includeAndOmit;

    const omit =
      role === STUDENT
        ? {
            followingCounts: true,
            postCounts: true,
          }
        : {};
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include,
      omit: { updatedAt: true, email: true, password: true, ...omit },
    });

    if (!user) throw new BadRequestException('User not found');

    return sendResponsive(user, 'User data successfully');
  }

  async JWTSign(payload: PayloadTokenType, refresh: boolean = false) {
    return await this.jwtService.signAsync(
      payload,
      refresh
        ? {
            secret: this.config.jwtRefreshSecret,
            expiresIn: this.config.jwtRefreshExpiresIn as any,
          }
        : {},
    );
  }
}
