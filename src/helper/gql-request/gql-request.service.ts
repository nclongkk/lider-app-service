import { request } from 'graphql-request';

import { IGqlRequestConfig } from './interfaces/request-config.interface';

export abstract class GqlRequestService {
  protected async request(gqlRequest: IGqlRequestConfig) {
    const { url, query, variables = null, headers = null } = gqlRequest;
    try {
      const data = await request(url, query, variables, headers);
      return this.handleRequestSuccess(data);
    } catch (error) {
      this.handleRequestError(error, gqlRequest);
    }
  }

  abstract handleRequestError(error: any, payload: any): any;
  handleRequestSuccess(data: any) {
    return data;
  }
}
