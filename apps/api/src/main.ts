import 'reflect-metadata';

import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { QueryFailedFilter } from '@common/filters/query-failed.filter';
import { AppUtils } from '@common/utils/app';
import { setupSwagger } from '@modules/@lib/config/setup-swagger';
import { createLogger } from '@modules/@lib/pino';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import { useContainer } from 'class-validator';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';
import { ApiConfigService } from './modules/@lib/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
    logger: await createLogger(),
    snapshot: true,
  });

  const logger = new Logger('Bootstrap');

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  AppUtils.killAppWithGrace(app);

  const configService = app.select(AppModule).get(ApiConfigService);
  const isDevelopment = configService.isDevelopment;

  /**
   * Security
   */
  app.use(compression());
  app.use(cookieParser());
  app.enable('trust proxy');
  app.set('etag', 'strong');
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb' }));
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.enableCors({
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    // maxAge: 3600,
    origin: configService.config.get<string>('app.allowedHosts'),
    allowedHeaders: '*',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  /**
   * Pipes
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
      forbidNonWhitelisted: false,
      dismissDefaultMessages: false,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
      enableDebugMessages: isDevelopment,
      validationError: {
        target: false,
        value: false,
      },
      stopAtFirstError: isDevelopment,
    }),
  );

  /**
   * Documentation
   */
  if (configService.getString('swagger.enabled')) {
    setupSwagger(app, configService.getNumber('app.port'));
  }

  /**
   * Middlewares
   */
  app.enableVersioning();

  const reflector = app.get(Reflector);
  /**
   * Exception filters
   */
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new QueryFailedFilter());

  /**
   * Interceptors
   */
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  await app.listen(configService.getNumber('app.port'), isDevelopment ? '0.0.0.0' : '');
  console.info(`Server running on ${await app.getUrl()}`);

  logger.log(
    `🚦 Accepting request only from: ${chalk.green(
      `${configService.getString('app.allowedOrigins')}`,
    )}`,
  );

  return app;
}

void bootstrap();
