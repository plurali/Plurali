import { ApiProperty } from '@nestjs/swagger';
import { VerificationRequestInterface } from './VerificationRequestInterface';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerificationRequest implements VerificationRequestInterface {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public code: string;
}
