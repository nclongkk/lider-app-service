import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';
import { ApiQuery } from '@nestjs/swagger';
import { isEnum } from 'class-validator';
import { randomInt } from 'crypto';
import { first } from 'lodash';

type EnumsParamOptions = {
  key: string;
  enum: SwaggerEnumType;
  required?: boolean;
};

const enumsDecorator = createParamDecorator(
  (
    options: EnumsParamOptions & { isSingle?: boolean },
    ctx: ExecutionContext,
  ) => {
    const { key, required, isSingle } = options;
    const request = ctx.switchToHttp().getRequest();
    const values: string[] = request.query[key]?.split(',');

    if (!values && !required) {
      return values;
    }

    const verifiedValues = values.filter((it) => isEnum(it, options.enum));
    return isSingle ? first(verifiedValues) : verifiedValues;
  },
);

export function EnumsQuery(options: EnumsParamOptions) {
  return (target: any, key: string, descriptor: any) => {
    ApiQuery({
      description: `Available enums: ${Object.values(options.enum)}`,
      example: Object.values(options.enum).join(','),
      name: options.key,
      required: !!options.required,
    })(target, key, Object.getOwnPropertyDescriptor(target, key));
    return enumsDecorator(options)(target, key, descriptor);
  };
}

export function EnumQuery(options: EnumsParamOptions) {
  return (target: any, key: string, descriptor: any) => {
    const values = Object.values(options.enum);
    ApiQuery({
      description: `Available enums: ${values}`,
      example: values[randomInt(values.length)],
      name: options.key,
      required: !!options.required,
    })(target, key, Object.getOwnPropertyDescriptor(target, key));
    return enumsDecorator({
      ...options,
      isSingle: true,
    })(target, key, descriptor);
  };
}
