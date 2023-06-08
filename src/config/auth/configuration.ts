export interface IAuthConfiguration {
  jwt: {
    accessTokenSecret: string;
    accessTokenLife: number;
  };
}

export const authConfigurationFn = (): IAuthConfiguration => ({
  jwt: {
    accessTokenLife:
      parseInt(process.env.ACCESS_JWT_LIFE ?? '', 10) || 3600 * 24, // 1 day
    accessTokenSecret: process.env.ACCESS_JWT_SECRET || 'nclongkk',
  },
});
