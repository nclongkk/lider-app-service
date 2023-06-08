import { Injectable } from '@nestjs/common';
import fastRedact from 'fast-redact';
import { NODE_ENV } from '../../constants';

import { ILogLevel, IRequestContextStore } from './logger.interface';

@Injectable()
export class LoggerConfigHelper {
  private readonly pinoLevels: ILogLevel = {
    debug: 20,
    error: 50,
    fatal: 60,
    info: 30,
    trace: 10,
    warn: 40,
  };

  public getLoggerLevelConfig(): ILogLevel {
    const enableLevels = process.env.LOG_LEVELS;

    Object.keys(this.pinoLevels).forEach((pinoLevel) => {
      if (enableLevels.includes('silent')) {
        // 0 is enable log level milestone
        this.pinoLevels[pinoLevel as keyof ILogLevel] = -1;
        return;
      }

      if (!enableLevels.includes(pinoLevel)) {
        // 0 is milestone to enable log level
        this.pinoLevels[pinoLevel as keyof ILogLevel] = -1;
      }
    });

    return { ...this.pinoLevels, enable: 0 };
  }

  public getTransportConfig(): any {
    return process.env.NODE_ENV === NODE_ENV.DEV
      ? {
          options: {
            colorize: true,
            ignore: 'pid,hostname,service',
            levelFirst: true,
            translateTime: 'SYS:standard',
          },
          target: 'pino-pretty',
        }
      : undefined;
  }

  public getRedactConfig(): { censor: string; paths: string[] } {
    return {
      censor: '********',
      paths: [
        'req.body.password',
        'req.headers.authorization',
        '*.user.password',
        '*.user.phone',
        '*.user.email',
        'req.file',
      ],
    };
  }

  public getCustomLogLevelFn() {
    return (_req: any, res: any) => {
      if (res.statusCode >= 500) {
        return 'error';
      }
      if (res.statusCode >= 400) {
        return 'warn';
      }
      return 'info';
    };
  }

  public getCustomPropsFn() {
    return (req: any) => {
      return {
        stack: req.stack,
        userId: req.user?.id,
      };
    };
  }

  public getFormattersConfig() {
    return {
      // level: (label: string): Record<string, any> => {
      //   return { level: label };
      // },
      bindings: (bindings) => {
        return {
          ...bindings,
          node_version: process.version,
        };
      },
    };
  }

  public getSerializersConfig() {
    return {
      req(req: any) {
        req.body = req.raw?.body;
        req.file = null;
        return req;
      },
    };
  }

  public getLogData(mergeObject: any): any {
    const res: IRequestContextStore['res'] = mergeObject?.res;
    const req = res?.req as any;
    const redact = fastRedact({
      paths: this.getRedactConfig().paths,
      remove: true,
    });
    const logData = {
      log: mergeObject.log,
      req: {
        body: req?.body,
        headers: req?.headers,
        id: req?.id,
        method: req?.method,
        params: req?.params,
        query: req?.query,
        remoteAddress:
          req?.headers['x-forwarded-for'] ?? req?.socket.remoteAddress,
        remotePort: req?.socket.remotePort,
        url: req?.url,
      },
      user: req?.user,
      res: {
        error: mergeObject.err,
        headers: res?.getHeaders(),
        statusCode: res?.statusCode,
      },
      stack: req?.stack,
    };

    return JSON.stringify(JSON.parse(redact(logData) as string), null, 2);
  }
}
