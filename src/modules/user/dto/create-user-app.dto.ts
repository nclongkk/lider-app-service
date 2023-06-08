import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserAppDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
