import { Module } from '@nestjs/common';
import type { I18nOptionsWithoutResolvers } from 'nestjs-i18n';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import path from 'path';

import { AppConfigService } from '../config.service';
import { NODE_ENV } from '../../constants';
import { AppI18nService } from '../../i18n/i18n.service';

@Module({
  exports: [AppI18nService],
  imports: [
    I18nModule.forRootAsync({
      inject: [AppConfigService],
      resolvers: [AcceptLanguageResolver],
      useFactory: (
        configService: AppConfigService,
      ): I18nOptionsWithoutResolvers => {
        const env = configService.get('app.env');
        return {
          fallbackLanguage: 'en',
          loaderOptions: {
            path:
              env === NODE_ENV.TEST
                ? 'src/i18n'
                : path.join(__dirname, '../../i18n/'),
            watch: true,
          },
        };
      },
    }),
  ],
  providers: [AppI18nService],
})
export class I18nConfigModule {}
