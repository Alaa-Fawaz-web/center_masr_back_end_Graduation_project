import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './globalErrorHandler';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonConfig } from './utils/logger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { ChatWsService } from './WS_Chat2/ChatWsService';

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

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins =
        process.env.NODE_ENV === 'production'
          ? [process.env.CLIENT_URL]
          : ['http://localhost:3000'];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  });

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3001);
}

bootstrap();
