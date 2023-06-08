import { Injectable } from '@nestjs/common';
import type { NoInferType, Path, PathValue } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

import type { configuration } from './configuration';

declare type ReturnTypeConfig = ReturnType<typeof configuration>;
declare type Configuration = {
  [path in Path<ReturnTypeConfig>]: PathValue<ReturnTypeConfig, path>;
};

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService<Configuration, true>) {}

  public get<
    T = Configuration,
    P extends Path<T> = Path<T>,
    R = PathValue<T, P>,
  >(propertyPath: P, defaultValue?: NoInferType<R>): R {
    if (defaultValue === undefined) {
      return this.configService.get<T, P, R>(propertyPath, {
        infer: true,
      });
    }

    return this.configService.get<T, P, R>(propertyPath, defaultValue, {
      infer: true,
    });
  }
}
