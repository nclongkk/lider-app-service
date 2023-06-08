import { Injectable } from '@nestjs/common';

import * as repo from './repositories';

@Injectable()
export class AppRepository {
  constructor(
    public readonly user: repo.UserRepository,
    public readonly meeting: repo.MeetingRepository,
  ) {}
}
