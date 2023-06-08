import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ACCESS_TYPE } from '../constants/meeting-access-type.constant';

export class MeetingStartDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  customRoomId: string;

  @IsString()
  @IsNotEmpty()
  appId: string;

  @IsObject()
  createdBy: any;

  @IsEnum(ACCESS_TYPE)
  accessType: ACCESS_TYPE;
}
