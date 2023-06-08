import type { ValidationArguments } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

import { MessageKey } from './i18n.key';

const msgKey = (
  key: MessageKey,
  { args, lang }: { args?: any; lang?: string } = {},
): { args: any; lang: string | undefined; key: MessageKey } => ({
  args,
  key,
  lang,
});

const formError = (
  errors: Record<string, MessageKey>,
  { args, lang }: { args?: any; lang?: string } = {},
): {
  args: any;
  lang: string | undefined;
  errors: Record<string, MessageKey>;
} => ({
  args,
  errors,
  lang,
});

const errorNotFoundMsg = (obj: string): { args: unknown; key: MessageKey } => ({
  args: { obj },
  key: 'error.common.not_found',
});

const errorExistedMsg = (obj: string): { args: unknown; key: MessageKey } => ({
  args: { obj },
  key: 'error.common.existed',
});

const errorForbiddenAccessMsg = (
  obj: string,
): { args: unknown; key: MessageKey } => ({
  args: { obj },
  key: 'error.common.forbidden_access',
});

const errorInvalidInputMsg = (
  obj: string,
): { args: unknown; key: MessageKey } => ({
  args: { obj },
  key: 'error.common.invalid',
});

// DTO
const appI18nValidationMessage = (
  key: MessageKey,
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  i18nValidationMessage(key, args);

const i18nIsBooleanMsg = (
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  appI18nValidationMessage('validation.is_boolean', args);

const i18nIsNumberMsg = (
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  appI18nValidationMessage('validation.is_number', args);

const i18nIsStringMsg = (
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  appI18nValidationMessage('validation.is_string', args);

const i18nIsNotEmptyMsg = (
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  appI18nValidationMessage('validation.is_not_empty', args);

const i18nIsEmailMsg = (
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  appI18nValidationMessage('validation.is_email', args);

const i18nLengthMsg = (
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  appI18nValidationMessage('validation.string_length', args);

const i18nIsEnumMsg = (
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  appI18nValidationMessage('validation.is_enum', args);

const i18nIsUrlMsg = (
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  appI18nValidationMessage('validation.is_url', args);

const i18nIsIntMsg = (
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  appI18nValidationMessage('validation.is_integer', args);

const i18nIsArrayMsg = (
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  appI18nValidationMessage('validation.is_array', args);

const i18nIsObjectMsg = (
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  appI18nValidationMessage('validation.is_object', args);

const i18nIsLongitudeMsg = (
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  appI18nValidationMessage('validation.is_longitude', args);

const i18nIsLatitudeMsg = (
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  appI18nValidationMessage('validation.is_latitude', args);

const i18nIsGreaterThanMsg = (
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  appI18nValidationMessage('validation.is_greater_than', args);

const i18nIsLessThanMsg = (
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  appI18nValidationMessage('validation.is_less_than', args);

const i18nIsDateStringMsg = (
  args?: unknown,
): ((validationArg: ValidationArguments) => string) =>
  appI18nValidationMessage('validation.is_date_string', args);

export {
  errorExistedMsg,
  errorForbiddenAccessMsg,
  errorInvalidInputMsg,
  errorNotFoundMsg,
  formError,
  i18nIsArrayMsg,
  i18nIsBooleanMsg,
  i18nIsDateStringMsg,
  i18nIsEmailMsg,
  i18nIsEnumMsg,
  i18nIsGreaterThanMsg,
  i18nIsIntMsg,
  i18nIsLatitudeMsg,
  i18nIsLessThanMsg,
  i18nIsLongitudeMsg,
  i18nIsNotEmptyMsg,
  i18nIsNumberMsg,
  i18nIsObjectMsg,
  i18nIsStringMsg,
  i18nIsUrlMsg,
  i18nLengthMsg,
  msgKey,
};
