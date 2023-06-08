import { Injectable } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

import { AppConfigService } from '../config.service';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: AppConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get('database.uri'),
      ignoreUndefined: true,
    };
  }
}
