import { Injectable } from '@nestjs/common';
import { I18nService, I18nContext, TranslateOptions } from 'nestjs-i18n';
import { MessageKey } from './i18n.key';

@Injectable()
export class AppI18nService {
  constructor(private i18n: I18nService) {}

  public translate<T = string>(key: MessageKey, options?: TranslateOptions): T {
    if (options?.lang !== undefined) {
      return this.i18n.translate(key as string, options) as T;
    }

    const i18nContext = I18nContext.current();
    return this.i18n.t(key as string, {
      lang: i18nContext?.lang ?? '',
      ...options,
    }) as T;
  }

  public t(key: MessageKey, options?: TranslateOptions) {
    return this.translate(key, options);
  }
}
