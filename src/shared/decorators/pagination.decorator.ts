import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const queries = ctx.switchToHttp().getRequest().query;
    return {
      page: Number(queries['page']) || 1,
      limit: Math.min(queries['limit'] || 10, 100),
      allRecords: queries['allRecords'] === 'true' ? true : false,
    };
  },
  [
    (target: any, key: string) => {
      ApiQuery({
        name: 'page',
        schema: { default: 1, type: 'number', minimum: 1 },
        required: false,
      })(target, key, Object.getOwnPropertyDescriptor(target, key));
      ApiQuery({
        name: 'limit',
        schema: { default: 10, type: 'number', minimum: 1, maximum: 100 },
        required: false,
      })(target, key, Object.getOwnPropertyDescriptor(target, key));
      ApiQuery({
        name: 'allRecords',
        schema: { default: false, type: 'boolean' },
        required: false,
      })(target, key, Object.getOwnPropertyDescriptor(target, key));
    },
  ],
);
