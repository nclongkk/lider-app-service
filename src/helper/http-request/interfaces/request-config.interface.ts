type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH';

export interface IRequestConfig {
  url: string;
  method: Method;
  data?: any;
  params?: any;
  headers?: any;
  lockRequestTtl?: number;
  retryOptions?: {
    times: number;
    interval?: number;
  };
  useLockRequest?: boolean;
}
