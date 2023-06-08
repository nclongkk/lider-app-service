import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AsyncService } from '../async/async.service';
import { IRequestConfig } from './interfaces/request-config.interface';
import { RedisLockService } from '../redis-helper/redis-lock.service';

@Injectable()
export class HttpRequestService {
  constructor(
    protected asyncService: AsyncService,
    protected httpService: HttpService,
    protected redisLockService: RedisLockService,
  ) {}
  protected async request(requestConfig: IRequestConfig, errorCb?: () => any) {
    const { method, url, lockRequestTtl, useLockRequest, retryOptions } =
      requestConfig;
    if (useLockRequest) {
      await this.redisLockService.lockRequest({
        key: `${method}:${url}`,
        ttl: lockRequestTtl,
      });
    }

    const { times = 0, ...retryOption } = retryOptions || {};

    try {
      const { data } = await this.asyncService.asyncRetry(
        async () => lastValueFrom(this.httpService.request(requestConfig)),
        times,
      );
      return data;
    } catch (error) {
      if (errorCb) {
        errorCb();
      }
      throw error;
    }
  }
}
