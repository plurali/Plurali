import { Trim } from '@app/common/validation/Trim';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthRequest {
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
