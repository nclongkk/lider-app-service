export interface ILoggerConfiguration {
  levels: string;
}

export const loggerConfigurationFn = (): ILoggerConfiguration => ({
  levels: process.env.LOG_LEVELS ?? 'trace,debug,info,warn,error,fatal',
});
