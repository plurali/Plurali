import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';
import { AuthRequest } from './AuthRequest';

export class RegisterRequest extends AuthRequest {
  @IsString()
  @IsEmail()
  @ApiProperty()
  public email: string;
}
