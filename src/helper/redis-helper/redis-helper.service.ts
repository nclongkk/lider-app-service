import * as _ from 'lodash';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as redisLock from 'redis-lock';
import { promisify } from 'util';
import { REQUEST } from '@nestjs/core';
import { RedisClient } from './redis-helper.providers';
import { REDIS_CLIENT } from './redis-helper.constant';

@Injectable()
export class RedisHelperService {
  constructor(
    @Inject(REQUEST) private request,
    @Inject(REDIS_CLIENT) private client: RedisClient,
  ) {}

  setKey(key, data, ttl = 0) {
    if (!_.isObject(data)) {
      throw new BadRequestException({
        i18nKey: 'error.unexpected_cache_data',
      });
    }

    if (!ttl) {
      ttl = (Math.floor(Math.random() * 5) + 3) * 1000;
    }

    const parseKey = encodeURIComponent(key);

    return new Promise<void>((resolve, reject) => {
      this.client.set(parseKey, JSON.stringify(data), 'EX', ttl, (error) => {
        if (error) {
          return reject(error);
        }
        return resolve();
      });
    });
  }

  getKey(key): Promise<any> {
    const parseKey = encodeURIComponent(key);
    return new Promise<void>((resolve) => {
      this.client.get(`${parseKey}`, function (err, value) {
        if (!value) {
          return resolve();
        }
        return resolve(JSON.parse(value));
      });
    });
  }

  deleteKey(key) {
    const parseKey = encodeURIComponent(key);
    return this.client.del(parseKey);
  }

  async setOrUpdate(key, data, ttlTime) {
    if (!_.isObject(data)) {
      throw new BadRequestException({
        i18nKey: 'error.error.unexpected_cache_data',
      });
    }

    const value = await this.getKey(key);
    if (!value) {
      return this.setKey(key, data, ttlTime);
    }

    this.client.ttl(key, (error, ttl) => {
      if (![-1, -2].includes(ttl)) {
        ttlTime = ttl;
      }

      const parseKey = encodeURIComponent(key);
      return this.client.set(parseKey, JSON.stringify(data), 'EX', ttlTime);
    });
  }
}
