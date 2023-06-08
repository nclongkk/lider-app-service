import { Provider } from '@nestjs/common';
import * as Redis from 'redis';
import { REDIS_CLIENT } from './redis-helper.constant';

export type RedisClient = ReturnType<typeof Redis.createClient>;

export const redisProviders: Provider[] = [
  {
    useFactory: (): RedisClient => {
      return Redis.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      });
    },
    provide: REDIS_CLIENT,
  },
];
