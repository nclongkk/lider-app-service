import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MeetingStartDto } from './dto/meeting-start.dto';
import { UpdateUserMeetingDto } from './dto/update-user-meeting.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { UserService } from './user.service';

@Controller('users-public')
export class UserPublicController {
  constructor(private readonly userService: UserService) {}

  @Post()
  verifyToken(@Body() verifyToken: VerifyTokenDto) {
    return this.userService.verifyToken(verifyToken);
  }

  @Post('start-meeting')
  startMeeting(@Body() meetingStart: MeetingStartDto) {
    return this.userService.startNewMeeting(meetingStart);
  }

  @Post(':roomId/new-user')
  newUser(
    @Param('roomId') roomId: string,
    @Body() updateUser: UpdateUserMeetingDto,
  ) {
    return this.userService.updateNewUserJoinMeeting(roomId, updateUser);
  }

  @Post(':roomId/user-left')
  userLeft(
    @Param('roomId') roomId: string,
    @Body() updateUser: UpdateUserMeetingDto,
  ) {
    return this.userService.updateUserLeaveMeeting(roomId, updateUser.userId);
  }

  @Post(':roomId/end-meeting')
  endMeeting(@Param('roomId') roomId: string) {
    return this.userService.endMeeting(roomId);
  }
}
