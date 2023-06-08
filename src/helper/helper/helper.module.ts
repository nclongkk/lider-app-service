import { Module, Global } from '@nestjs/common';
import { HelperService } from './helper.service';

@Global()
@Module({
  imports: [],
  providers: [HelperService],
  exports: [HelperService],
})
export class HelperModule {}
