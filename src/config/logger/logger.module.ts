import { Global, Module } from '@nestjs/common';
import type { Params } from 'nestjs-pino';
import { LoggerModule } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';
import * as pino from 'pino';

import { AppLoggerService } from '../../logger/logger.service';
import { LoggerConfigHelper } from './logger-config.helper';
import { LoggerMiddlewareModule } from './logger-middleware.module';

@Global()
@Module({
  exports: [AppLoggerService],
  imports: [
    LoggerModule.forRootAsync({
      inject: [LoggerConfigHelper],
      providers: [LoggerConfigHelper],
      useFactory: (loggerConfigHelper: LoggerConfigHelper): Params => {
        return {
          pinoHttp: {
            level: process.env.PINO_LOG_LEVEL || 'debug',
            // customLevels: loggerConfigHelper.getLoggerLevelConfig(),
            // customLogLevel: loggerConfigHelper.getCustomLogLevelFn(),
            customProps: loggerConfigHelper.getCustomPropsFn(),
            formatters: loggerConfigHelper.getFormattersConfig(),
            genReqId: () => uuidv4(),
            // level: 'enable',
            // levelVal: 0,
            redact: loggerConfigHelper.getRedactConfig(),
            serializers: loggerConfigHelper.getSerializersConfig(),
            transport: loggerConfigHelper.getTransportConfig(),
            // useOnlyCustomLevels: true,
            timestamp: pino.stdTimeFunctions.isoTime,
          },
        };
      },
    }),
    LoggerMiddlewareModule,
  ],
  providers: [AppLoggerService],
})
export class LoggerConfigModule {}
