import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './globalErrorHandler';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonConfig } from './utils/logger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonConfig,
  });

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation for my NestJS project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.use(helmet());

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

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

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
