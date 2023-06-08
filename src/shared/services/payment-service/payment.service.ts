import { ChargeServiceFeeDto } from './dtos/charge-service-fee.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AsyncService } from '../../../helper/async/async.service';
import { HttpRequestService } from '../../../helper/http-request/http-request.service';
import { RedisLockService } from '../../../helper/redis-helper/redis-lock.service';
import { AppConfigService } from '../../../config/config.service';

@Injectable()
export class PaymentService extends HttpRequestService {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly asyncService: AsyncService,
    protected readonly redisLockService: RedisLockService,
    private readonly configService: AppConfigService,
  ) {
    super(asyncService, httpService, redisLockService);
  }

  async chargeServiceFee({ amount, userId, meetingId }: ChargeServiceFeeDto) {
    return this.request({
      url: `${this.configService.get(
        'service.payment.url',
      )}/internal/charge-service-fee`,
      method: 'POST',
      data: {
        amount,
        userId,
        meetingId,
      },
    });
  }
}
