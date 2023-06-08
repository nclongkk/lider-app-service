import type { Request, Response } from 'express';
import type { Logger } from 'pino';

export interface ILogLevel extends Record<string, number> {
  debug: number;
  error: number;
  fatal: number;
  info: number;
  trace: number;
}

export interface ILogParams {
  msg?: string;
  log?: Record<string, unknown>;
}

export interface IRequestContextStore {
  logger: Logger;
  req?: Record<string, any> & Request;
  res?: Record<string, any> & Response;
}
