export interface IDatabaseConfiguration {
  uri: string;
}

export const databaseConfigurationFn = (): IDatabaseConfiguration => ({
  uri: process.env.DATABASE_URI ?? 'mongodb://localhost:27017/lider',
});
