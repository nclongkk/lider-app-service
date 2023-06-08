export interface RetryOptions {
  times?: number;
  interval?: number;
  errorFilter?: (err: any) => boolean;
}
