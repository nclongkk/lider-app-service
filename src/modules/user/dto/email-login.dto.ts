import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { i18nIsNotEmptyMsg, i18nIsStringMsg } from '../../../i18n/i18n.helper';

export class EmailLoginDto {
  @ApiProperty({ type: String })
  @Transform(({ value }) => value?.toLowerCase?.().trim())
  @IsEmail()
  readonly email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: i18nIsNotEmptyMsg() })
  @IsString({ message: i18nIsStringMsg() })
  readonly password: string;
}
