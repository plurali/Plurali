import { IsNotEmpty, IsString } from 'class-validator';
import { VerifyUserEmailRequestInterface } from './VerifyUserEmailRequestInterface';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyUserEmailRequest implements VerifyUserEmailRequestInterface {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public code: string;
}
