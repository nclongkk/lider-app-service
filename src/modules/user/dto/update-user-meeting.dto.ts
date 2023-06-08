import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateUserMeetingDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  connectedAt: Date;

  @IsString()
  @IsOptional()
  disconnectedAt: Date;

  @IsObject()
  @IsOptional()
  metadata: any;
}
