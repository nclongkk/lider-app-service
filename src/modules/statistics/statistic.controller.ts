import { Controller, Get, Query } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../shared/decorators';
import { GqlAuthGuard } from '../../shared/services/auth-service/guard/gql-auth.guard';
import { StatisticService } from './statistic.service';

@ApiTags('Statistics')
@ApiBasicAuth()
@GqlAuthGuard()
@Controller('statistics')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('time-frequency')
  async statisticTimeFrequency(@CurrentUser() user) {
    return this.statisticService.statisticTimeFrequency(user);
  }

  @Get('total')
  async statisticTotalMeetings(@CurrentUser() user) {
    return this.statisticService.statisticTotalMeetings(user);
  }

  @Get('meetings')
  async statisticMeetings(@CurrentUser() user, @Query() query: any) {
    return this.statisticService.statisticMeetings(user, query);
  }
}
