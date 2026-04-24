import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';

const envSchema = z.object({
  JWT_SECRET_KEY: z.string(),
  JWT_EXPIRES_IN: z.string().default('1d'),
  JWT_REFRESH_SECRET_KEY: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  JWT_ISSUER: z.string().default('my-app'),
});

@Injectable()
export default class AppConfig {
  constructor(private configService: ConfigService) {}

  private get validatedEnv() {
    return envSchema.parse(process.env);
  }
  get jwtSecret(): string {
    return this.validatedEnv.JWT_SECRET_KEY;
  }

  get jwtExpiresIn(): string {
    return this.validatedEnv.JWT_EXPIRES_IN;
  }

  get jwtRefreshSecret(): string {
    return this.validatedEnv.JWT_REFRESH_SECRET_KEY;
  }

  get jwtRefreshExpiresIn(): string {
    return this.validatedEnv.JWT_REFRESH_EXPIRES_IN;
  }

  get jwtIssuer(): string {
    return this.validatedEnv.JWT_ISSUER;
  }
}
