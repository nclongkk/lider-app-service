import { NODE_ENV } from '../../constants';

export interface IAppConfiguration {
  env: string;
  port: number;
}

export const appConfigurationFn = (): IAppConfiguration => ({
  env: process.env.NODE_ENV ?? NODE_ENV.DEV,
  port: parseInt(process.env.PORT ?? '', 10) || 3000,
});
