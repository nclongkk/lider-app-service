import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserAppDto } from './dto/create-user-app.dto';
import { UserService } from './user.service';

@Controller('users-internal')
export class UserInternalsController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUserApp(@Body() body: CreateUserAppDto) {
    this.userService.createUserApp(body.userId);
  }
}
