import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './globalErrorHandler';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonConfig } from './utils/logger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { ChatWsService } from './WS_Chat2/ChatWsService';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonConfig,
  });

  app.use(helmet());

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      transform: true,
    }),
  );

  const server = app.getHttpServer();
  const wsServer = app.get(ChatWsService);
  wsServer.setServer(server);

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.use(cookieParser());

  app.use(morgan('dev'));

  app.use(json());
  const allowedOrigins = [process.env.CLIENT_URL1, process.env.CLIENT_URL2];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3001);
}

bootstrap();
