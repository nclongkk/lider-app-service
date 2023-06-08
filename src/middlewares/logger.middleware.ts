import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { storage } from 'nestjs-pino/storage';

import { IRequestContextStore } from '../logger/logger.interface';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: AppLoggerService) {}

  public use(req: Request, res: Response, next: NextFunction): void {
    const requestContextStore: IRequestContextStore | undefined =
      storage.getStore();

    if (requestContextStore === undefined) {
      this.logger.error({
        error: new Error("Can't get request context store"),
      });
      next();
      return;
    }

    requestContextStore.req = req;
    requestContextStore.res = res;
    next();
  }
}
