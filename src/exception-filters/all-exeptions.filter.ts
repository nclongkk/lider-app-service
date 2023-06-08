import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { Request, Response } from 'express';
import _ from 'lodash';
import { MessageKey } from '../i18n/i18n.key';
import { AppI18nService } from '../i18n/i18n.service';
import { AppLoggerService } from '../logger/logger.service';

interface II18nDTOError {
  property: string;
  children: II18nDTOError[];
  constraints: Record<string, string>;
}

interface IException extends HttpException {
  errors?: any[];
  responseBody?: any;
}

interface IExceptionResponse extends Record<string, unknown> {
  key?: MessageKey;
  args?: Record<string, any>;
  lang?: string;
  errors?: Record<string, MessageKey>;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private logger: AppLoggerService,
    private i18n: AppI18nService,
  ) {}

  public catch(exception: any, host: ArgumentsHost): void {
    try {
      switch (true) {
        case exception instanceof HttpException:
          this.catchHttpExceptionError(exception as IException, host);
          return;

        default:
          this.catchDefaultException(exception, host);
      }
    } catch (error) {
      this.logger.error({ error: error as Error, log: exception });
      this.catchDefaultException(exception, host);
    }
  }

  public catchHttpExceptionError(
    exception: IException,
    host: ArgumentsHost,
  ): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const statusCode: number = exception.getStatus();
    let message;
    let messageCode;
    let responseErrors;
    const exceptionResponse = exception.getResponse() as IExceptionResponse;
    switch (true) {
      case !_.isNil(exceptionResponse.key): {
        const { message: resolvedMessage, messageCode: resolvedMessageCode } =
          this.resolveManualThrowError(exceptionResponse);

        message = resolvedMessage;
        messageCode = resolvedMessageCode;
        break;
      }

      case !_.isEmpty(exceptionResponse.errors): {
        const {
          errors,
          message: resolvedMessage,
          messageCode: resolvedMessageCode,
        } = this.resolveFormError(exceptionResponse);

        message = resolvedMessage;
        messageCode = resolvedMessageCode;
        responseErrors = errors;
        break;
      }

      case !_.isEmpty(exception.errors): {
        const {
          errors,
          message: resolvedMessage,
          messageCode: resolvedMessageCode,
        } = this.resolveValidationError(exception);

        message = resolvedMessage;
        messageCode = resolvedMessageCode;
        responseErrors = errors;
        break;
      }

      default: {
        messageCode = exception.message;
        message = this.i18n.t(messageCode as MessageKey);
        break;
      }
    }

    const responseBody = {
      errors: responseErrors,
      message,
      messageCode,
      path: httpAdapter.getRequestUrl(request) as string,
      requestId: request.id,
      statusCode,
    };
    exception.responseBody = responseBody;
    httpAdapter.reply(response, responseBody, statusCode);
  }

  public catchDefaultException(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    console.log(exception);
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = {
      message: this.i18n.t('error.internal_server_error'),
      messageCode: 'error.internal_server_error',
      path: httpAdapter.getRequestUrl(request) as string,
      requestId: request.id,
      statusCode,
    };
    exception.responseBody = responseBody;
    httpAdapter.reply(response, responseBody, statusCode);
  }

  public getErrorMessage({
    error,
    i18n,
    parentProperty,
  }: {
    i18n: AppI18nService;
    error: II18nDTOError | undefined;
    parentProperty?: string;
  }): {
    messageCode: string | undefined;
    message: string | undefined;
    property: string | undefined;
  } {
    if (error === undefined) {
      return {
        message: undefined,
        messageCode: undefined,
        property: undefined,
      };
    }

    const { children, constraints } = error;
    const property =
      parentProperty !== undefined
        ? `${parentProperty}.${error.property}`
        : error.property;
    const constraint = Object.values(constraints)[0];
    if (constraint === undefined) {
      return this.getErrorMessage({
        error: children[0],
        i18n,
        parentProperty: property,
      });
    }

    const [translationKey, argsString] = constraint.split('|');
    const args: Record<string, any> =
      argsString !== undefined ? JSON.parse(argsString) : {};

    return {
      message: this.i18n.t(translationKey as MessageKey, {
        args: { property, ...args },
      }),
      messageCode: translationKey,
      property,
    };
  }

  public resolveValidationError(exception: IException): {
    errors: Record<string, string>;
    message: string;
    messageCode: string;
  } {
    const errorsObjs = (exception.errors as II18nDTOError[]).map((item) => {
      return this.getErrorMessage({
        error: item,
        i18n: this.i18n,
      });
    });
    const messageObj = errorsObjs[0];
    const messageCode = messageObj?.messageCode ?? exception.message;
    const message: string =
      messageObj?.message ?? this.i18n.t(messageCode as MessageKey);
    const errors: Record<string, string> = {};
    errorsObjs.forEach((item) => {
      if (item.property !== undefined && item.message !== undefined) {
        errors[item.property] = item.message;
      }
    });

    return {
      errors,
      message,
      messageCode,
    };
  }

  public resolveManualThrowError(exceptionResponse: IExceptionResponse): {
    message: string;
    messageCode: string;
  } {
    const messageCode = exceptionResponse.key ?? 'error.default_message';
    const message = this.i18n.t(messageCode, {
      args: exceptionResponse.args ?? {},
    });
    return {
      message,
      messageCode,
    };
  }

  public resolveFormError(exceptionResponse: IExceptionResponse): {
    errors: Record<string, string>;
    message: string;
    messageCode: string;
  } {
    const formError = exceptionResponse.errors as Record<string, string>;
    const errors: Record<string, string> = {};
    for (const key in formError) {
      if (_.has(formError, key)) {
        errors[key] = this.i18n.t(formError[key] as MessageKey, {
          args: {
            property: key,
            ...exceptionResponse.args,
          },
        });
      }
    }

    const key = Object.keys(errors)[0] ?? '';
    const messageCode = formError[key] ?? 'error.default_message';
    const message: string = errors[key] ?? this.i18n.t('error.default_message');

    return {
      errors,
      message,
      messageCode,
    };
  }
}
