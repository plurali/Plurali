import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';
import { AuthRequest } from './AuthRequest';
import { Trim } from '@app/common/validation/Trim';

export class RegisterRequest extends AuthRequest {
  @IsString()
  @IsEmail()
  @Trim()
  @ApiProperty()
  public email: string;
}
