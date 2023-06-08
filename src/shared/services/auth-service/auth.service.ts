import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AsyncService } from '../../../helper/async/async.service';
import { RedisLockService } from '../../../helper/redis-helper/redis-lock.service';
import { AppConfigService } from '../../../config/config.service';
import { HttpRequestService } from '../../../helper/http-request/http-request.service';

@Injectable()
export class AuthService extends HttpRequestService {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly asyncService: AsyncService,
    protected readonly redisLockService: RedisLockService,
    private readonly configService: AppConfigService,
  ) {
    super(asyncService, httpService, redisLockService);
  }

  async verifyToken(token: string) {
    token = token.startsWith('Bearer ') ? token : 'Bearer ' + token;
    try {
      const { result } = await this.request({
        method: 'GET',
        url: this.configService.get('service.auth.url') + '/verify-token',
        headers: {
          Authorization: token,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}
