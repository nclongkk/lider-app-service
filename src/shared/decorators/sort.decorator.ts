import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ISortOrder } from '../interfaces/sort.interface';

export const Sort = createParamDecorator(
  (data: string, ctx: ExecutionContext): ISortOrder => {
    const queries = ctx.switchToHttp().getRequest().query;
    const sort = queries['sort'];
    if (!sort) {
      return {
        createdAt: -1,
      };
    }
    return sort.split(',').reduce((acc, val: string) => {
      acc[val.trim().replace(/^[+-\s]/, '')] = val.startsWith('-') ? -1 : 1;
      return acc;
    }, {} as { [key: string]: number });
  },
);
