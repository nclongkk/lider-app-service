import * as _ from 'lodash';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import redisLock from 'redis-lock';
import { promisify } from 'util';
import { REQUEST } from '@nestjs/core';
import { RedisClient } from './redis-helper.providers';
import { REDIS_CLIENT } from './redis-helper.constant';

@Injectable()
export class RedisLockService {
  private readonly redisLock;
  constructor(
    @Inject(REQUEST) private request,
    @Inject(REDIS_CLIENT) private client: RedisClient,
  ) {
    this.redisLock = promisify(redisLock(this.client));
  }

  async lockRequest({
    key,
    req = this.request,
    ttl,
    forceLock = false,
  }: {
    key: string;
    req?: any;
    ttl?: number;
    forceLock?: boolean;
  }) {
    if (!ttl) {
      ttl = (Math.floor(Math.random() * 5) + 3) * 1000;
    }

    const parseKey = encodeURIComponent(key);
    const unlock = await this.redisLock(parseKey, ttl);
    if (!forceLock) {
      req.unlock = () => {
        unlock();
        delete req.unlock;
      };
    }

    return req.unlock;
  }
}
