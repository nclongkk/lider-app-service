import { Global, Module } from '@nestjs/common';

import { redisProviders } from './redis-helper.providers';
import { RedisHelperService } from './redis-helper.service';
import { RedisLockService } from './redis-lock.service';

@Global()
@Module({
  providers: [...redisProviders, RedisHelperService, RedisLockService],
  exports: [...redisProviders, RedisHelperService, RedisLockService],
})
export class RedisHelperModule {}
