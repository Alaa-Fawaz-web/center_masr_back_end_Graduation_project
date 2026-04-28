import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import AppConfigModule from 'src/config/config.module';
import AppConfig from 'src/config/app.config';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    AppConfigModule,

    JwtModule.registerAsync({
      global: true,
      imports: [AppConfigModule],
      inject: [AppConfig],
      useFactory: (config: AppConfig) => ({
        secret: config.jwtSecret,
        signOptions: {
          expiresIn: config.jwtExpiresIn as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
