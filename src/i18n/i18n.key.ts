import type { Path, PathValue } from '@nestjs/config';
import type error from './en/error.json';
import type validation from './en/validation.json';

declare interface IMessage {
  error: typeof error;
  validation: typeof validation;
}
export declare type MessageKey = keyof {
  [K in Path<IMessage> as PathValue<IMessage, K> extends Record<string, any>
    ? never
    : K]: string;
};
