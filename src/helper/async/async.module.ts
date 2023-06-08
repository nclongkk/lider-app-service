import { Module, Global } from '@nestjs/common';
import { AsyncService } from './async.service';

@Global()
@Module({
  imports: [],
  providers: [AsyncService],
  exports: [AsyncService],
})
export class AsyncModule {}
