export interface IMailConfiguration {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  adminEmail: string;
}

export const mailConfigurationFn = (): IMailConfiguration => ({
  clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
  clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
  refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
  adminEmail: process.env.ADMIN_EMAIL_ADDRESS || 'nclongkk@gmail.com',
});
