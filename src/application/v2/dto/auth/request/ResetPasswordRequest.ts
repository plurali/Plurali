import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ResetPasswordRequestInterface } from './ResetPasswordRequestInterface';
import { ApiProperty } from '@nestjs/swagger';
import { VerificationRequest } from '../../partials/VerificationRequest';

export class ResetPasswordRequest extends VerificationRequest implements ResetPasswordRequestInterface {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public password: string;
}
