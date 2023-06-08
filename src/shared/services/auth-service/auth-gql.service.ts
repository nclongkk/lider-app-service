import { HttpException, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { AppConfigService } from '../../../config/config.service';
import { GqlRequestService } from '../../../helper/gql-request/gql-request.service';
import { AppLoggerService } from '../../../logger/logger.service';

@Injectable()
export class AuthGqlService extends GqlRequestService {
  private authGqlUrl = this.configService.get('service.auth.gqlUrl');
  constructor(
    private readonly configService: AppConfigService,
    private readonly logger: AppLoggerService,
  ) {
    super();
  }

  handleRequestError(error: any, payload: any) {
    this.logger.error({
      msg: 'Query user schema auth service error',
      error,
      log: payload,
    });

    const errResponse = _.get(error, 'response.errors[0]', {});
    throw new HttpException(
      new Error(errResponse.message || 'Failed to get user info'),
      errResponse.extensions?.statusCode,
    );
  }

  async queryUser(token: string, query: string, variables: any = null) {
    const { user } = await this.request({
      url: this.authGqlUrl,
      query,
      variables,
      headers: {
        Authorization: token,
      },
    });
    return user;
  }
}
