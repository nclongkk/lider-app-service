import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigService } from './config.service';
import { configuration } from './configuration';

@Global()
@Module({
  exports: [AppConfigService],
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [AppConfigService],
})
export class ConfigurationModule {}
