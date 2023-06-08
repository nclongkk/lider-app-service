import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { GqlAuthGuard } from './shared/services/auth-service/guard/gql-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(@Req() req): string {
    return this.appService.getHello();
  }
}
