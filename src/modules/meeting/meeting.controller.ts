import { Body, Controller, Get, Query, Req, Post } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from '../../shared/decorators/pagination.decorator';
import { PaginationParam } from '../../shared/interfaces';
import { GqlAuthGuard } from '../../shared/services/auth-service/guard/gql-auth.guard';
import { MeetingService } from './meeting.service';

@ApiTags('Meeting')
@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @ApiQuery({
    name: 'from',
    required: false,
    type: Date,
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: Date,
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
  })
  @ApiQuery({
    name: 'isEnded',
    required: false,
    type: Boolean,
  })
  @ApiQuery({
    name: 'isPaid',
    required: false,
    type: Boolean,
  })
  @ApiQuery({
    name: 'isUnpaid',
    required: false,
    type: Boolean,
  })
  @ApiQuery({
    name: 'accessType',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'roomId',
    required: false,
    type: String,
  })
  @GqlAuthGuard()
  @Get()
  meetingHistory(
    @Req() req: any,
    @Pagination() paginationParam?: PaginationParam,
    @Query() query?: any,
  ) {
    return this.meetingService.meetingHistory(
      req.user._id,
      paginationParam,
      query,
    );
  }

  @GqlAuthGuard()
  @Post('retry-charge')
  retryCharge(@Req() req: any, @Body('meetingId') meetingId: string) {
    return this.meetingService.retryCharge(meetingId, req.user);
  }
}
