import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  webUrl: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  customRoomId: string;
}
