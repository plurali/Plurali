import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthRequestInterface } from './AuthRequestInterface';
import { Trim } from '@app/common/validation/Trim';

export class AuthRequest implements AuthRequestInterface {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Trim()
  public username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public password: string;
}
