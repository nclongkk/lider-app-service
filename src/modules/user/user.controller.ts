import { Body, Controller, Get, Post, Put, Query, Req } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from '../../shared/decorators/pagination.decorator';
import { PaginationParam } from '../../shared/interfaces';
import { GqlAuthGuard } from '../../shared/services/auth-service/guard/gql-auth.guard';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GqlAuthGuard()
  @Get()
  getAppDetail(@Req() req: any) {
    return this.userService.getAppDetail(req.user._id);
  }

  @GqlAuthGuard()
  @Put('web-url')
  updateAppWebUrl(@Req() req: any, @Body('webUrl') webUrl: string) {
    return this.userService.updateAppWebUrl(req.user._id, webUrl);
  }

  @GqlAuthGuard()
  @Post('token')
  generateToken(@Req() req: any) {
    return this.userService.generateToken(req.user._id);
  }
}
