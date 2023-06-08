import { Global, Module } from '@nestjs/common';
import { HttpRequestService } from './http-request.service';

@Global()
@Module({
  imports: [],
  providers: [HttpRequestService],
  exports: [HttpRequestService],
})
export class HttpRequestModule {}
