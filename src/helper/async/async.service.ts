import { Injectable } from '@nestjs/common';
import retry from 'async/retry';
import { RetryOptions } from './interface/async-option.interface';

@Injectable()
export class AsyncService {
  asyncRetry(asyncTask, options?: RetryOptions | number) {
    if (typeof options === 'number') {
      return retry(options, asyncTask);
    }

    return retry(
      {
        times: 5,
        interval: 3000,
        ...options,
      },
      asyncTask,
    );
  }
}
