import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGqlService } from '../auth-gql.service';
import { DEFAULT_USER_QUERY } from '../auth-graphql-query';
import { Reflector } from '@nestjs/core';

@Injectable()
export class Guard implements CanActivate {
  constructor(
    private authGqlClient: AuthGqlService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;

    if (!bearerToken) {
      throw new UnauthorizedException();
    }

    const gqlQuery =
      this.reflector.get<string>('gqlQuery', context.getHandler()) ||
      DEFAULT_USER_QUERY;
    try {
      const user = await this.authGqlClient.queryUser(bearerToken, gqlQuery);
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}

export const GqlAuthGuard = (gqlQuery = '') => {
  return applyDecorators(SetMetadata('gqlQuery', gqlQuery), UseGuards(Guard));
};
