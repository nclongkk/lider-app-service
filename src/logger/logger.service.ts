import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { storage } from 'nestjs-pino/storage';
import type { Bindings, Logger } from 'pino';

import type { ILogParams, IRequestContextStore } from './logger.interface';

@Injectable()
export class AppLoggerService {
  constructor(private pinoLogger: PinoLogger) {}

  public trace({ log = {}, msg }: ILogParams): void {
    this.pinoLogger.trace({ log }, msg);
  }

  public debug({ log = {}, msg }: ILogParams): void {
    this.pinoLogger.debug({ log }, msg);
  }

  public info({ log = {}, msg }: ILogParams): void {
    this.pinoLogger.info({ log }, msg);
  }

  public warn({ log = {}, msg }: ILogParams): void {
    this.pinoLogger.warn({ log }, msg);
  }

  public error({
    error,
    log = {},
    msg = error.message,
  }: ILogParams & { error: Error }): void {
    const requestContextStore: IRequestContextStore | undefined =
      storage.getStore();

    if (requestContextStore === undefined) {
      // eslint-disable-next-line no-console
      console.error("Can't get request context store!");
    }
    const logData = {
      err: error,
      log,
      res: requestContextStore?.res,
    };

    this.pinoLogger.error(logData, msg);
  }

  public fatal({ log = {}, msg }: ILogParams): void {
    this.pinoLogger.fatal({ log }, msg);
  }

  public setContext(context: string): void {
    this.pinoLogger.setContext(context);
  }

  public getPinoLogger(): Logger {
    return this.pinoLogger.logger;
  }

  public assign(log = {}): void {
    this.pinoLogger.assign(log);
  }

  public pushToLogStack(log = {}): void {
    const requestContextStore: IRequestContextStore | undefined =
      storage.getStore();
    if (
      requestContextStore === undefined ||
      requestContextStore.req === undefined
    ) {
      this.error({ error: new Error("Can't get request context store!"), log });
      return;
    }

    if (requestContextStore.req.stack !== undefined) {
      (requestContextStore.req.stack as unknown[]).push(log);
    } else {
      requestContextStore.req.stack = [log];
    }
  }

  public bindings(): Bindings {
    return this.pinoLogger.logger.bindings();
  }
}
