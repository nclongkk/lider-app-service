export interface ISwaggerConfiguration {
  mode: string;
  username: string;
  password: string;
}

export const swaggerConfigurationFn = (): ISwaggerConfiguration => {
  return {
    mode: process.env.SWAGGER_MODE ?? '',
    username: process.env.SWAGGER_USERNAME ?? 'ecomdy',
    password: process.env.SWAGGER_PASSWORD ?? '123123',
  };
};
