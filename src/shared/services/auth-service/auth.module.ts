import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { AuthGqlService } from './auth-gql.service';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [AuthService, AuthGqlService],
  exports: [AuthService, AuthGqlService],
})
export class AuthModule {}
