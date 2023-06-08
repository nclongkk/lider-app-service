import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
