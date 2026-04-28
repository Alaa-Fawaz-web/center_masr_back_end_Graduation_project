import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export default class AppConfig {
  constructor(private configService: ConfigService) {}

  private get validatedEnv() {
    return process.env;
  }

  get nodeEnv() {
    return this.validatedEnv.NODE_ENV as 'development' | 'production';
  }

  get host(): string {
    return this.validatedEnv.HOST as string;
  }

  get port(): number {
    return Number(this.validatedEnv.PORT);
  }

  get clientUrl(): string {
    return this.validatedEnv.CLIENT_URL as string;
  }

  get DATABASE_URL(): string {
    return this.validatedEnv.DATABASE_URL as string;
  }

  get jwtSecret(): string {
    return this.validatedEnv.JWT_SECRET_KEY as string;
  }

  get jwtExpiresIn(): string {
    return this.validatedEnv.JWT_EXPIRES_IN as string;
  }

  get jwtRefreshSecret(): string {
    return this.validatedEnv.JWT_REFRESH_SECRET_KEY as string;
  }

  get jwtRefreshExpiresIn(): string {
    return this.validatedEnv.JWT_REFRESH_EXPIRES_IN as string;
  }

  get redisHost(): string {
    return this.validatedEnv.REDIS_HOST as string;
  }

  get redisPort(): number {
    return Number(this.validatedEnv.REDIS_PORT) as number;
  }
}
