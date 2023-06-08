import { Module } from '@nestjs/common';
import { MeetingModule } from '../meeting/meeting.module';
import { UserController } from './user.controller';

import { UserService } from './user.service';
import { UserInternalsController } from './users-internal.controller';
import { UserPublicController } from './users-public.controller';

@Module({
  imports: [MeetingModule],
  controllers: [UserController, UserPublicController, UserInternalsController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
