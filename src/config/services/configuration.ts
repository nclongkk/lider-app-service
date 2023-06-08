export interface IServicesConfiguration {
  auth: {
    url: string;
    gqlUrl: string;
  };
  payment: {
    url: string;
  };
}

export const servicesConfigurationFn = (): IServicesConfiguration => ({
  auth: {
    url: process.env.AUTH_SERVICE_URL || 'http://localhost/api/auth',
    gqlUrl:
      process.env.AUTH_SERVICE_GQL_URL || 'http://localhost/api/auth/graphql',
  },
  payment: {
    url: process.env.PAYMENT_SERVICE_URL || 'http://localhost/api/payments',
  },
});
