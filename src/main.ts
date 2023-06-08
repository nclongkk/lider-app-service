import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { i18nValidationErrorFactory } from 'nestjs-i18n';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import compression from 'compression';
import helmet from 'helmet';

import { SwaggerConfig } from './config/swagger/swagger.config';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';
import { AllExceptionsFilter } from './exception-filters/all-exeptions.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AppLoggerService } from './logger/logger.service';
import { AppI18nService } from './i18n/i18n.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    autoFlushLogs: true,
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.use(compression());
  app.enableCors();
  app.setGlobalPrefix('api/app');
  app.get(SwaggerConfig).setupSwagger(app);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: i18nValidationErrorFactory,
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(
    new AllExceptionsFilter(
      app.get(HttpAdapterHost),
      app.get(AppLoggerService),
      app.get(AppI18nService),
    ),
  );
  const port = app.get(AppConfigService).get('app.port');
  await app.listen(port, '0.0.0.0', () => {
    app.get(Logger).log(`Running on port ${port}`);
  });
}
bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
});
